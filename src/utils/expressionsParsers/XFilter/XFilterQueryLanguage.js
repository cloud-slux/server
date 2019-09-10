const { createToken, Lexer, EmbeddedActionsParser, tokenMatcher } = require('chevrotain');

// ----------------- lexer -----------------
// using the NA pattern marks this Token class as 'irrelevant' for the Lexer.
// AdditionOperator defines a Tokens category, The parser can match against such categories

const LogicalConnector = createToken({
  name: 'LogicalConnector',
  pattern: Lexer.NA
});
const And = createToken({
  name: 'And',
  pattern: /.AND./,
  categories: LogicalConnector
});
const Or = createToken({
  name: 'Or',
  pattern: /.OR./,
  categories: LogicalConnector
});
const Nor = createToken({
  name: 'Nor',
  pattern: /.NOR./,
  categories: LogicalConnector
});

// const LogicalOperator = createToken({
//   name: 'LogicalOperator',
//   pattern: Lexer.NA
// });
// const Not = createToken({
//   name: 'Not',
//   pattern: /.NOT./,
//   categories: LogicalOperator
// });

// as a convenience to reduce verbosity.
const SingleFilterOperator = createToken({
  name: 'SingleFilterOperator',
  pattern: Lexer.NA
});
const Equals = createToken({
  name: 'Equals',
  pattern: /\$eq/,
  categories: SingleFilterOperator
});
const NotEquals = createToken({
  name: 'NotEquals',
  pattern: /\$ne/,
  categories: SingleFilterOperator
});
const Contains = createToken({
  name: 'Contains',
  pattern: /\$cts/,
  categories: SingleFilterOperator
});
const GreaterEqualsThan = createToken({
  name: 'GreaterEqualsThan',
  pattern: /\$gte/,
  categories: SingleFilterOperator
});
const GreaterThan = createToken({
  name: 'GreaterThan',
  pattern: /\$gt/,
  categories: SingleFilterOperator
});
const LessEqualsThan = createToken({
  name: 'LessEqualsThan',
  pattern: /\$lte/,
  categories: SingleFilterOperator
});
const LessThan = createToken({
  name: 'LessThan',
  pattern: /\$lt/,
  categories: SingleFilterOperator
});

const DoubleFilterOperator = createToken({
  name: 'DoubleFilterOperator',
  pattern: Lexer.NA
});
const Between = createToken({
  name: 'Between',
  pattern: /\$btw/,
  categories: DoubleFilterOperator
});

const ArrayFilterOperator = createToken({
  name: 'ArrayFilterOperator',
  pattern: Lexer.NA
});
const In = createToken({
  name: 'In',
  pattern: /\$in/,
  categories: ArrayFilterOperator
});

const NotIn = createToken({
  name: 'NotIn',
  pattern: /\$nin/,
  categories: ArrayFilterOperator
});

const LParen = createToken({ name: 'LParen', pattern: /\(/ });
const RParen = createToken({ name: 'RParen', pattern: /\)/ });
const LSquare = createToken({ name: 'LSquare', pattern: /\[/ });
const RSquare = createToken({ name: 'RSquare', pattern: /\]/ });

const Field = createToken({
  name: 'Field',
  pattern: /'([^']*)'/
});

const StringValue = createToken({
  name: 'StringValue',
  pattern: /"(:?[^\\"\n\r]+|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/
});

const NumberValue = createToken({
  name: 'NumberValue',
  pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/
});

const TrueValue = createToken({
  name: 'TrueValue',
  pattern: /true/
});

const FalseValue = createToken({
  name: 'FalseValue',
  pattern: /false/
});

const Comma = createToken({ name: 'Comma', pattern: /,/ });
const Colon = createToken({ name: 'Colon', pattern: /:/ });

// marking WhiteSpace as 'SKIPPED' makes the lexer skip it.
const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED
});

const allTokens = [
  // whitespace is normally very common so it should be placed first to speed up the lexer's performance
  WhiteSpace,
  LParen,
  RParen,
  LSquare,
  RSquare,
  Comma,
  Colon,
  Field,
  StringValue,
  NumberValue,
  TrueValue,
  FalseValue,
  In,
  NotIn,
  Between,
  LessEqualsThan,
  LessThan,
  GreaterEqualsThan,
  GreaterThan,
  Contains,
  Equals,
  NotEquals,
  Nor,
  Or,
  And,
  // Not,
  // LogicalOperator,
  SingleFilterOperator,
  DoubleFilterOperator,
  ArrayFilterOperator,
  LogicalConnector
];
const XFilterLexer = new Lexer(allTokens);

// ----------------- parser -----------------
// We must extend `EmbeddedActionsParser` to enable support
// for output based on the embedded actions.
class XFilterParser extends EmbeddedActionsParser {
  // Unfortunately no support for class fields with initializer in ES2015, only in esNext...
  // so the parsing rules are defined inside the constructor, as each parsing rule must be initialized by
  // invoking RULE(...)
  // see: https://github.com/jeffmo/es-class-fields-and-static-properties
  constructor() {
    super(allTokens);

    const $ = this;

    $.RULE('expression', () => {
      return `{ ${$.SUBRULE($.logicalExpression)}  }`;
    });

    $.RULE('logicalExpression', () => {
      let filterExp, op, rightTerm, returnValue;

      // parsing part
      filterExp = $.SUBRULE($.filterExpression);
      returnValue = filterExp;
      $.MANY(() => {
        op = $.CONSUME(LogicalConnector);
        //  the index "2" in SUBRULE2 is needed to identify the unique position in the grammar during runtime
        rightTerm = $.SUBRULE2($.logicalExpression);

        // interpreter part
        let operand;
        if (tokenMatcher(op, And)) {
          operand = '$and';
        } else if (tokenMatcher(op, Or)) {
          operand = '$or';
        } else if (tokenMatcher(op, Nor)) {
          operand = '$nor';
        } else {
          console.log('cuma?');
        }

        if (!!operand) {
          returnValue = `"${operand}" : [ { ${filterExp} }, { ${rightTerm} } ]`;
        }
      });

      return returnValue;
    });

    $.RULE('value', () =>
      $.OR([
        { ALT: () => $.CONSUME(StringValue) },
        { ALT: () => $.CONSUME(NumberValue) },
        { ALT: () => $.CONSUME(TrueValue) },
        { ALT: () => $.CONSUME(FalseValue) }
      ])
    );

    $.RULE('filterExpression', () =>
      $.OR([
        { ALT: () => $.SUBRULE($.parenthesisExpression) },
        { ALT: () => $.SUBRULE($.singleFilterExpression) },
        { ALT: () => $.SUBRULE($.doubleFilterExpression) },
        { ALT: () => $.SUBRULE($.arrayFilterExpression) }
      ])
    );

    $.RULE('singleFilterExpression', () => {
      let fieldObj;
      let field, op, value;

      fieldObj = $.CONSUME(Field).image;
      op = $.CONSUME(SingleFilterOperator);
      value = $.SUBRULE($.value).image;

      field = fieldObj.replace(new RegExp("'", 'g'), '');

      if (tokenMatcher(op, Equals)) {
        return `"${field}" : ${value}`;
      } else if (tokenMatcher(op, NotEquals)) {
        return `"${field}" : { "$ne" : ${value} }`;
      } else if (tokenMatcher(op, Contains)) {
        return `"${field}" : { "$regex": ${value}, "$options": "i" } `;
      } else if (tokenMatcher(op, GreaterEqualsThan)) {
        return `"${field}" : { "$gte" : ${value} }`;
      } else if (tokenMatcher(op, GreaterThan)) {
        return `"${field}" : { "$gt" : ${value} }`;
      } else if (tokenMatcher(op, LessEqualsThan)) {
        return `"${field}" : { "$lte" : ${value} }`;
      } else if (tokenMatcher(op, LessThan)) {
        return `"${field} : { "$lt" : ${value} }`;
      }
    });

    $.RULE('doubleFilterExpression', () => {
      let fieldObj;
      let field, op, value1, value2;

      fieldObj = $.CONSUME(Field).image;
      op = $.CONSUME(DoubleFilterOperator);
      value1 = $.SUBRULE($.value).image;
      $.CONSUME(Colon);
      value2 = $.SUBRULE2($.value).image;

      field = fieldObj.replace(new RegExp("'", 'g'), '');

      if (tokenMatcher(op, Between)) {
        return `"${field}" : { "$gte": ${value1}, "$lte" : ${value2} }`;
      } else {
        console.log('cuma?');
      }
    });

    $.RULE('arrayFilterExpression', () => {
      let fieldObj;
      let field, op;

      fieldObj = $.CONSUME(Field).image;
      op = $.CONSUME(ArrayFilterOperator);

      field = fieldObj.replace(new RegExp("'", 'g'), '');

      const arr = [];
      $.CONSUME(LSquare);
      $.MANY_SEP({
        SEP: Comma,
        DEF: () => {
          let value = $.SUBRULE($.value).image;
          arr.push(value);
        }
      });
      $.CONSUME(RSquare);

      const arrs = arr.toString();

      if (tokenMatcher(op, In)) {
        return '"' + field + '" : { "$in" : [' + arrs + '] }';
      } else if (tokenMatcher(op, NotIn)) {
        return '"' + field + '" : { "$nin" : [' + arrs + '] }';
      } else {
        console.log('cuma?');
      }
    });

    $.RULE('parenthesisExpression', () => {
      let expValue;

      $.CONSUME(LParen);
      expValue = $.SUBRULE($.logicalExpression);
      $.CONSUME(RParen);

      return `${expValue}`;
    });

    // very important to call this after all the rules have been defined.
    // otherwise the parser may not work correctly as it will lack information
    // derived during the self analysis phase.
    this.performSelfAnalysis();
  }
}

// reuse the same parser instance.
const parser = new XFilterParser();

// wrapping it all together
module.exports = function(text) {
  const lexResult = XFilterLexer.tokenize(text);
  // setting a new input will RESET the parser instance's state.
  parser.input = lexResult.tokens;
  // any top level rule may be used as an entry point
  const value = parser.expression();

  return {
    value: value,
    lexResult: lexResult,
    parseErrors: parser.errors
  };
};
