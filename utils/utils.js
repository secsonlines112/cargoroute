const jwt = require("jsonwebtoken")
require("dotenv").config()
const { Admin } = require("../database/databaseConfig")


const secret = process.env.SECRET_KEY



module.exports.generateAcessToken = (email) => {
    let token = jwt.sign({ email: email }, secret, { expiresIn: "5000h" })
    return token
}


module.exports.verifyAdmin = async (req, res, next) => {
    try {
        console.log('verifying admin')
        let token = req.headers["header"]

        if (!token) {
            throw new Error("a token is needed")
        }
        const decodedToken = jwt.verify(token, secret)
        let admin = await Admin.findOne({ email: decodedToken.email })

        console.log(admin)
        
        req.user = admin
        next()
    } catch (err) {
        console.log(err)
        let error = new Error("not authorize")
        error.statusCode = 301
        error.message = err.message
        return next(error)
    }
}

/*
module.exports.verifyAdmin = async (req, res, next) => {
    try {
        console.log('verifying admin')
        let token = req.headers["header"]

        if (!token) {
            throw new Error("a token is needed")
        }
        const decodedToken = jwt.verify(token, 'littlesecret')
        let admin = await Admin.findOne({ email: decodedToken.email })

        console.log(admin)
        
        req.user = admin
        next()
    } catch (err) {
        console.log(err)
        let error = new Error("not authorize")
        error.statusCode = 301
        error.message = err.message
        return next(error)
    }
}*/






module.exports.shipmentNotification = (
    shipper_name,
    shipper_phoneNumber,
    shipper_address,
    shipper_email,
    receiver_name,
    receiver_email,
    receiver_phoneNumber,
    receiver_address,
    CosignmentNo,
) => {
    return `
<div >
    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">

    An order with the Reference No ${CosignmentNo} has been shipped to you. kindly  visit our website on https://www.kargoofreight.cloud.com to track the shippment with its Reference No
    </p>

    <h2 style=" margin-bottom:30px; width: 100%; text-align: center ">Shippment Information</h2>


    <div style=" margin-bottom: 30px; width: 100%; display: flex; flex-direction: row ">
        <div style=" width: 50%; display: flex; flex-direction: column; align-items: flex-start">

            <p style=" margin-bottom: 30px; font-size: 1rem ;width: 100%;display:flex; flex-direction: column; align-items: flex-start">Shipper Name</p>

        </div>
        <div style=" width: 50%; display: flex; flex-direction: column; align-items: flex-end">

            <p style=" margin-bottom: 30px; font-size: 1rem ;width: 100%;display:flex; flex-direction: column; align-items: flex-end">${shipper_name}</p>

        </div>



    </div>

    <div style=" margin-bottom: 30px; width: 100%; display: flex; flex-direction: row ">
        <div style=" width: 50%; display: flex; flex-direction: column; align-items: flex-start">

            <p style=" margin-bottom: 30px; font-size: 1rem ;width: 100%;display:flex; flex-direction: column; align-items: flex-start">Shipper Phone Number</p>

        </div>
        <div style=" width: 50%; display: flex; flex-direction: column; align-items: flex-end">

            <p style=" margin-bottom: 30px; font-size: 1rem ;width: 100%;display:flex; flex-direction: column; align-items: flex-end">${shipper_phoneNumber}</p>

        </div>

    </div>


    <div style=" margin-bottom: 30px; width: 100%; display: flex; flex-direction: row ">
        <div style=" width: 50%; display: flex; flex-direction: column; align-items: flex-start">

            <p style=" margin-bottom: 30px; font-size: 1rem ;width: 100%;display:flex; flex-direction: column; align-items: flex-start">
            Shipper Address
            </p>

        </div>
        <div style=" width: 50%; display: flex; flex-direction: column; align-items: flex-end">
            <p style=" margin-bottom: 30px; font-size: 1rem ;width: 100%;display:flex; flex-direction: column; align-items: flex-end">${shipper_address}</p>

        </div>



    </div>

    <div style=" margin-bottom: 30px; width: 100%; display: flex; flex-direction: row ">
        <div style=" width: 50%; display: flex; flex-direction: column; align-items: flex-start">

            <p style=" margin-bottom: 30px; font-size: 1rem ;width: 100%;display:flex; flex-direction: column; align-items: flex-start">
            Shipper Email
            </p>

        </div>
        <div style=" width: 50%; display: flex; flex-direction: column; align-items: flex-end">

            <p style=" margin-bottom: 30px; font-size: 1rem ;width: 100%;display:flex; flex-direction: column; align-items: flex-end">${shipper_email}</p>

        </div>

    </div>

     <div style=" margin-bottom: 30px; width: 100%; display: flex; flex-direction: row ">
        <div style=" width: 50%; display: flex; flex-direction: column; align-items: flex-start">

            <p style=" margin-bottom: 30px; font-size: 1rem ;width: 100%;display:flex; flex-direction: column; align-items: flex-start">
            Name of Receiver
            
            
            </p>

        </div>
        <div style=" width: 50%; display: flex; flex-direction: column; align-items: flex-end">

            <p style=" margin-bottom: 30px; font-size: 1rem ;width: 100%;display:flex; flex-direction: column; align-items: flex-end">${receiver_name}</p>

        </div>

    </div>




    <div style=" margin-bottom: 30px; width: 100%; display: flex; flex-direction: row ">
        <div style=" width: 50%; display: flex; flex-direction: column; align-items: flex-start">

            <p style=" margin-bottom: 30px; font-size: 1rem ;width: 100%;display:flex; flex-direction: column; align-items: flex-start">
            
            Email of Receiver

            </p>

        </div>
        <div style=" width: 50%; display: flex; flex-direction: column; align-items: flex-end">

            <p style=" margin-bottom: 30px; font-size: 1rem ;width: 100%;display:flex; flex-direction: column; align-items: flex-end">${receiver_email}</p>

        </div>

    </div>

    <div style=" margin-bottom: 30px; width: 100%; display: flex; flex-direction: row ">
        <div style=" width: 50%; display: flex; flex-direction: column; align-items: flex-start">

            <p style=" margin-bottom: 30px; font-size: 1rem ;width: 100%;display:flex; flex-direction: column; align-items: flex-start">
            Address of Receiver
            
            </p>

        </div>
        <div style=" width: 50%; display: flex; flex-direction: column; align-items: flex-end">

            <p style=" margin-bottom: 30px; font-size: 1rem ;width: 100%;display:flex; flex-direction: column; align-items: flex-end">${receiver_address}</p>

        </div>

    </div>

    
    


</div>`

}



module.exports.shipmentArrival = (location,CosignmentNo) => {
    return `
<div >
    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">

    Your order with the Reference No ${CosignmentNo} is in  ${location}
    </p>
   

</div>`

}


module.exports.shipmentMessage = (message) => {
    return `
<div >
    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">
    ${message}
    </p>

</div>`

}