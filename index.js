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

app.post("/penyakit", async (req, res, next) => {
  const { kode, deskripsi } = req.body
  try {
    if (empty(kode)) {
      throw new Error("Kode Penyakit harus diisi.")
    }

    if (empty(deskripsi)) {
      throw new Error("Deskripsi Penyakit harus diisi.")
    }

    // Validasi Kode Penyakit
    let resPenyakit = await db.oneOrNone(
      `SELECT id FROM penyakit where kode='${kode}'`
    )
    if (!empty(resPenyakit)) {
      // console.log(resPenyakit)
      throw new Error(
        "Kode Penyakit sudah dipakai, harap gunakan kode yang lain."
      )
    }
    await db.query(
      `INSERT INTO penyakit(kode,deskripsi) VALUES('${kode}', '${deskripsi}')`
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

app.put("/penyakit/:id", async (req, res, next) => {
  const { id } = req.params
  const { kode, deskripsi } = req.body
  // console.log(id)
  try {
    if (empty(kode)) {
      throw new Error("Kode Penyakit harus diisi.")
    }

    if (empty(deskripsi)) {
      throw new Error("Deskripsi Penyakit harus diisi.")
    }

    // Validasi Kode Penyakit
    let resPenyakit = await db.oneOrNone(
      `SELECT id FROM penyakit where kode='${kode}' AND id != ${id}`
    )
    // console.log(resPenyakit)
    if (!empty(resPenyakit)) {
      // console.log(resPenyakit)
      throw new Error(
        "Kode Penyakit sudah dipakai, harap gunakan kode yang lain."
      )
    }
    await db.query(
      `UPDATE penyakit SET kode='${kode}',deskripsi='${deskripsi}' WHERE id=${id}`
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

app.delete("/penyakit/:id", async (req, res, next) => {
  const { id } = req.params
  // console.log(id)
  try {
    await db.query(`DELETE FROM penyakit WHERE id=${id}`)

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

app.get("/diagnosa", async (req, res, next) => {
  const { page = 1, perpage = 10, cari } = req.query
  try {
    let filterCari = !empty(cari)
      ? `AND kode LIKE '%${cari}%' OR deskripsi LIKE '%${cari}%'`
      : ""
    // console.log({page,perpage})
    let offset = (page - 1) * perpage

    let sql = `SELECT * FROM penyakit WHERE TRUE ${filterCari} OFFSET ${offset} LIMIT ${perpage}`
    let resPenyakit = await db.query(sql)

    // Dapatkan gejala dari masing-masing penyakit
    for (let i = 0; i < resPenyakit.length; i++) {
      const el = resPenyakit[i]
      let resGejala = await db.query(
        `SELECT idgejala,bobot FROM diagnosa WHERE idpenyakit=${el.id}`
      )
      resPenyakit[i]["gejala"] = resGejala
    }

    let queryCount = `SELECT COUNT(id) as jml FROM penyakit WHERE TRUE ${filterCari}`
    let additional = await db.query(queryCount)
    let dataCount = additional[0].jml
    let pageCount = Math.ceil(dataCount / perpage)
    res.json({
      message: "Berhasil",
      data: resPenyakit,
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

app.post("/cek-diagnosa", async (req, res, next) => {
  const { gejala: inputGejala } = req.body
  try {
    if (empty(inputGejala)) {
      throw new Error("Daftar gejala harus diisi.")
    }
    if (typeof inputGejala !== "object") {
      throw new Error("Field gejala harus berupa array of int.")
    }

    let resPenyakit = await db.query(`SELECT * FROM penyakit`)
    for (let i = 0; i < resPenyakit.length; i++) {
      const el = resPenyakit[i]
      let resGejala = await db.query(
        `SELECT idgejala,bobot FROM diagnosa WHERE idpenyakit=${el.id}`
      )
      // resPenyakit[i]["gejala"] = resGejala

      let similarity = 0
      for (let j = 0; j < resGejala.length; j++) {
        for (let k = 0; k < inputGejala.length; k++) {
          const inGej = inputGejala[k]
          const gej = resGejala[j]
          if (inGej == gej.idgejala) similarity += parseFloat(gej.bobot)
        }
      }

      resPenyakit[i]["similarity"] = similarity
    }

    res.json({
      message: "Berhasil",
      data: resPenyakit,
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
