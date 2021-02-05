export const config = {
  "dev": {
    "username": process.env.PGUSERNAME,
    "password": process.env.PGUPWD,
    "database": process.env.PGDB,
    "host": process.env.PGHOST,
    "dialect": "postgres",
    "aws_region": process.env.PGHOSTAWSREGION,
    "aws_profile": process.env.PGHOSTAWSPROFILE,
    "aws_media_bucket": process.env.PGHOSTAWSS3BUCKET
  },
  "prod": {
    "username": "",
    "password": "",
    "database": "udagram_prod",
    "host": "",
    "dialect": "postgres"
  },
  "jwt": {
    "secret": ""
  }
}
