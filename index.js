import express from "express"
import dotenv from "dotenv"
import requestIP from "request-ip"

dotenv.config()

var app = express()

import cors from "cors"
import { empty } from "./helper/function.js"
import moment from "moment"
import db from "./util/database.js"
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}
const whitelist = [
  "http://localhost:3000",
  "https://indodax-sinyal-app.herokuapp.com/",
]
app.use(cors()) // Use this after the variable declaration
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(function (req, res, next) {
//   // Website you wish to allow to connect
//   // res.setHeader(
//   //   "Access-Control-Allow-Origin",
//   //   "https://webdokter.herokuapp.com"
//   // );
//   const origin = req.headers.origin
//   if (whitelist.includes(origin)) {
//     res.setHeader("Access-Control-Allow-Origin", origin)
//   }
//   // Request methods you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   )

//   // Request headers you wish to allow
//   res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type")

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader("Access-Control-Allow-Credentials", true)

//   // Pass to next layer of middleware
//   next()
// })

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})

app.get("/gejala", async (req, res, next) => {
  const { page = 1, perpage = 10, cari } = req.query
  try {
    let filterCari = !empty(cari)
      ? `AND kode LIKE '%${cari}%' OR deskripsi LIKE '%${cari}%'`
      : ""
    // console.log({page,perpage})
    let offset = (page - 1) * perpage

    let sql = `SELECT * FROM gejala WHERE TRUE ${filterCari} OFFSET ${offset} LIMIT ${perpage}`
    let resGejala = await db.query(sql)

    let queryCount = `SELECT COUNT(id) as jml FROM gejala WHERE TRUE ${filterCari}`
    let additional = await db.query(queryCount)
    let dataCount = additional[0].jml
    let pageCount = Math.ceil(dataCount / perpage)
    res.json({
      message: "Berhasil",
      data: resGejala,
      pageCount,
      dataCount,
    })
  } catch (e) {
    res.status(500)
    res.json({
      data: [],
      pageCount: 0,
      dataCount: 0,
      errorMessage: e.message,
      error: e,
    })
  }
})

app.post("/gejala", async (req, res, next) => {
  const { kode, deskripsi } = req.body
  try {
    if (empty(kode)) {
      throw new Error("Kode Gejala harus diisi.")
    }

    if (empty(deskripsi)) {
      throw new Error("Deskripsi Gejala harus diisi.")
    }

    // Validasi Kode Gejala
    let resGejala = await db.oneOrNone(
      `SELECT id FROM gejala where kode='${kode}'`
    )
    if (!empty(resGejala)) {
      // console.log(resGejala)
      throw new Error(
        "Kode Gejala sudah dipakai, harap gunakan kode yang lain."
      )
    }
    await db.query(
      `INSERT INTO gejala(kode,deskripsi) VALUES('${kode}', '${deskripsi}')`
    )

    res.json({
      message: "Berhasil",
    })
  } catch (e) {
    res.status(500)
    res.json({
      data: [],
      pageCount: 0,
      dataCount: 0,
      errorMessage: e.message,
      error: e,
    })
  }
})

app.put("/gejala/:id", async (req, res, next) => {
  const { id } = req.params
  const { kode, deskripsi } = req.body
  // console.log(id)
  try {
    if (empty(kode)) {
      throw new Error("Kode Gejala harus diisi.")
    }

    if (empty(deskripsi)) {
      throw new Error("Deskripsi Gejala harus diisi.")
    }

    // Validasi Kode Gejala
    let resGejala = await db.oneOrNone(
      `SELECT id FROM gejala where kode='${kode}' AND id != ${id}`
    )
    console.log(resGejala)
    if (!empty(resGejala)) {
      // console.log(resGejala)
      throw new Error(
        "Kode Gejala sudah dipakai, harap gunakan kode yang lain."
      )
    }
    await db.query(
      `UPDATE gejala SET kode='${kode}',deskripsi='${deskripsi}' WHERE id=${id}`
    )

    res.json({
      message: "Berhasil",
    })
  } catch (e) {
    res.status(500)
    res.json({
      data: [],
      pageCount: 0,
      dataCount: 0,
      errorMessage: e.message,
      error: e,
    })
  }
})

app.delete("/gejala/:id", async (req, res, next) => {
  const { id } = req.params
  // console.log(id)
  try {
    await db.query(`DELETE FROM gejala WHERE id=${id}`)

    res.json({
      message: "Berhasil",
    })
  } catch (e) {
    res.status(500)
    res.json({
      data: [],
      pageCount: 0,
      dataCount: 0,
      errorMessage: e.message,
      error: e,
    })
  }
})

app.get("/penyakit", async (req, res, next) => {
  const { page = 1, perpage = 10, cari } = req.query
  try {
    let filterCari = !empty(cari)
      ? `AND kode LIKE '%${cari}%' OR deskripsi LIKE '%${cari}%'`
      : ""
    // console.log({page,perpage})
    let offset = (page - 1) * perpage

    let sql = `SELECT * FROM penyakit WHERE TRUE ${filterCari} OFFSET ${offset} LIMIT ${perpage}`
    let resGejala = await db.query(sql)

    let queryCount = `SELECT COUNT(id) as jml FROM penyakit WHERE TRUE ${filterCari}`
    let additional = await db.query(queryCount)
    let dataCount = additional[0].jml
    let pageCount = Math.ceil(dataCount / perpage)
    res.json({
      message: "Berhasil",
      data: resGejala,
      pageCount,
      dataCount,
    })
  } catch (e) {
    res.status(500)
    res.json({
      data: [],
      pageCount: 0,
      dataCount: 0,
      errorMessage: e.message,
      error: e,
    })
  }
})