module.exports = {
  port: process.env.PORT || 8081,
  db: {
    database: process.env.DB_NAME || 'd1mbtjhlrkfura',
    user: process.env.DB_USER || 'glfguvteabceme',
    password:
      process.env.DB_PASSWORD || 'd3de2da92defaa09275175283f89ecf67adbb3801beba8c724630d560131a89d',
    options: {
      dialect: process.env.DIALECT || 'postgres',
      protocol: process.env.PROTOCOL || 'postgres',
      host: process.env.HOST || 'ec2-54-197-234-117.compute-1.amazonaws.com',
      dialectOptions: {
        ssl: process.env.SSL || true
      }
    }
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'secret'
  }
}
