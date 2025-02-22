const express = require("express")
const router = express.Router()
const { verifyAdmin} = require("../utils/utils")
const { deleteCosignment, newConsignment, updateCosignment,sendEmail,validateToken, getHistories } = require("../controller/admin")

let login = require("../controller/admin").login
let signup = require("../controller/admin").signup

let getAdmin = require("../controller/admin").getAdmin
let updateAdmin = require("../controller/admin").updateAdmin

let getCosignments = require("../controller/admin").getCosignments
let getCosignment = require("../controller/admin").getCosignment
let newHistory = require("../controller/admin").newHistory 
let updateHistory = require("../controller/admin").updateHistory 

//auth routes
router.post("/validate-token",validateToken )
router.post('/adminlogin',login)
router.post('/adminsignup',signup)

//Admin Routes
router.get('/admin/:id',verifyAdmin,getAdmin)
router.patch('/admin/:id',verifyAdmin,updateAdmin)


//Cosignment route Routes
router.get('/cosignments',verifyAdmin,getCosignments)
router.get('/cosignments/:id',verifyAdmin,getCosignment)
router.patch('/cosignments/:id',verifyAdmin,updateCosignment)
router.delete('/cosignments/:id',verifyAdmin,deleteCosignment)
router.post('/cosignment',verifyAdmin,newConsignment)


// history route
router.post('/sendemail',sendEmail)
router.get('/histories/:id',verifyAdmin,getHistories)
router.post('/history',verifyAdmin,newHistory)
router.patch('/histories/:id',verifyAdmin,updateHistory)



exports.router = router