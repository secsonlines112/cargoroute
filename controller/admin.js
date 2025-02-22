const express = require("express")
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const { generateAcessToken, shipmentMessage } = require('../utils/utils')
const { Admin, Cosignment, User, History } = require("../database/databaseConfig");
const { validationResult } = require("express-validator");
const random_number = require('random-number')
const Mailjet = require('node-mailjet')


Cosignment.find().then(data=>{
   console.log(data)
})


module.exports.validateToken = async (req, res, next) => {
   try {
      // Get the token from the "Authorization" header and remove the "Bearer " prefix
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
         console.log('token')

         return res.status(401).json({
            response: "A token is required for authentication"
         });
      }

      // Verify the token with the secret key
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      const user = await Admin.findOne({ email: decodedToken.email });

      if (!user) {
         console.log('token')
         // If the user does not exist, return a 404 response
         return res.status(404).json({
            response: "User not found"
         });
      }



      // Return a success response with user data if the token is valid
      return res.status(200).json({
         response: token,
         user: user
      });

   } catch (error) {
      // If the token is invalid or any other error occurs, handle it here
      return res.status(401).json({
         response: error.message || "An error occurred. Please try again later."
      });
   }
}

module.exports.signup = async (req, res, next) => {
   try {
      //email verification
      let { password, email, secretKey } = req.body

      //checking for validation error
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
         let error = new Error("invalid user input")
         return next(error)
      }

      //check if the email already exist
      let adminExist = await Admin.findOne({ email: email })

      if (adminExist) {
         let error = new Error("admin is already registered")
         //setting up the status code to correctly redirect user on the front-end
         error.statusCode = 301
         return next(error)
      }


      //check for secretkey
      if (secretKey !== 'tracking') {
         let error = new Error("secretKey mismatched")
         error.statusCode = 300
         return next(error)
      }
      //delete all previous admin

      let deleteAdmins = await Admin.deleteMany()

      if (!deleteAdmins) {
         let error = new Error("an error occured on the server")
         error.statusCode = 300
         return next(error)

      }


      //hence proceed to create models of admin and token
      let newAdmin = new Admin({
         _id: new mongoose.Types.ObjectId(),
         email: email,
         password: password,
      })

      let savedAdmin = await newAdmin.save()

      if (!savedAdmin) {
         //cannot save user
         let error = new Error("an error occured")
         return next(error)
      }

      let token = generateAcessToken(email)

      //at this point,return jwt token and expiry alongside the user credentials
      return res.status(200).json({
         response: {
            admin: savedAdmin,
            token: token,
            expiresIn: '500',
         }
      })


   } catch (error) {
      console.log(error)
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}

module.exports.login = async (req, res, next) => {
   try {
      let { email, password } = req.body
      //checking for validation error
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
         let error = new Error("invalid user input")
         return next(error)
      }

      let adminExist = await Admin.findOne({ email: email })


      if (!adminExist) {
         return res.status(404).json({
            response: "admin is not yet registered"
         })
      }

      //check if password corresponds
      if (adminExist.password != password) {
         let error = new Error("Password does not match")
         return next(error)
      }

      let token = generateAcessToken(email)

      //at this point,return jwt token and expiry alongside the user credentials
      return res.status(200).json({
         response: {
            admin: adminExist,
            token: token,
            expiresIn: '500',
         }
      })


   } catch (error) {
      console.log(error)
      error.message = error.message || "an error occured try later"
      return next(error)

   }
}
//admin routes
module.exports.getAdmin = async (req, res, next) => {

   try {
      let adminId = req.params.id

      let admin_ = await Admin.findOne({ _id: adminId })


      if (!admin_) {
         let error = new Error("user not found")
         return next(error)
      }

      return res.status(200).json({
         response: {
            admin_
         }
      })
   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)

   }
}
module.exports.updateAdmin = async (req, res, next) => {
   try {
      let {
         email, password, walletAddress, phoneNumber, name, bitcoinwalletaddress, zellewalletaddress, etheriumwalletaddress,
         cashappwalletaddress,
         gcashname,
         gcashphonenumber,
      } = req.body


      let adminId = req.params.id

      let admin_ = await Admin.findOne({ _id: adminId })

      if (!admin_) {
         let error = new Error("user not found")
         return next(error)
      }

      //update admin

      admin_.email = email || ''
      admin_.password = password || ''
      admin_.walletAddress = walletAddress || ''
      admin_.phoneNumber = phoneNumber || ''
      admin_.name = name || ''

      admin_.bitcoinwalletaddress = bitcoinwalletaddress || ''

      admin_.zellewalletaddress = zellewalletaddress || ''
      admin_.etheriumwalletaddress = etheriumwalletaddress || ''
      admin_.cashappwalletaddress = cashappwalletaddress || ''
      admin_.gcashname = gcashname || ''
      admin_.gcashphonenumber = gcashphonenumber || ''

      let savedAdmin = await admin_.save()

      return res.status(200).json({
         response: savedAdmin
      })


   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)

   }
}


// Cosignment route
module.exports.getCosignments = async (req, res, next) => {
   try {
      let Cosignment_ = await Cosignment.find()
      if (!Cosignment_) {
         let error = new Error("An error occured")
         return next(error)
      }
      return res.status(200).json({
         response: Cosignment_
      })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}
module.exports.getCosignment = async (req, res, next) => {
   try {
      let CosignmentId = req.params.id
      let Cosignment_ = await Cosignment.findOne({ _id: CosignmentId })

      if (!Cosignment_) {
         let error = new Error('an error occured')
         return next(error)
      }

      return res.status(200).json({
         response: {
            Cosignment_
         }
      })
   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)

   }
}



module.exports.deleteCosignment = async (req, res, next) => {
   try {
      let CosignmentId = req.params.id
      let Cosignment_ = await Cosignment.deleteOne({ _id: CosignmentId })
      if (!Cosignment_) {
         let error = new Error("an error occured")
         return next(error)
      }
      return res.status(200).json({
         response: {
            message: 'deleted successfully'
         }
      })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)

   }
}

module.exports.newConsignment = async (req, res, next) => {
   try {
      let {
         payment_mode,
         carrier,
         destination,
         shipment_mode, 
         origin,
         package,
         status,
         shipper_name,
         shipper_phoneNumber,
         shipper_address,
         shipper_email,
         receiver_name,
         receiver_email,
         receiver_phoneNumber,
         receiver_address,
         weight,
         product,
         departure_time,
         pick_up_time, // Adjusted field name to match the form
         qty,
         total_freight,
         pick_up_date, // Adjusted field name to match the form
         expected_delivery_date,
         comments, // Added comments field from the form,
         longitude, // Assuming this is optional
         lattitude,
         type_of_shipment
      } = req.body;


      // Generate the random number part for the consignment reference (10 digits)
      let randomPart = random_number({
         min: 1000000000, // Ensure it's a 10-digit number
         max: 9999999999, // Ensure it's a 10-digit number
         integer: true
      });


      let reference_number = `KG${randomPart}SHP`;

      // Create a new consignment object with the provided data
      const newConsignment = new Cosignment({
         carrier_reference_no: reference_number,
         payment_mode,
         carrier,
         destination,
         shipment_mode, // Adjusted field name to match form
         origin,
         package, // Adjusted field name to match form
         status,
         shipper_name,
         shipper_phoneNumber,
         shipper_address,
         shipper_email,
         receiver_name,
         receiver_email,
         receiver_phoneNumber,
         receiver_address,
         weight,
         type_of_shipment,
         product,
         departure_time,
         pick_up_time, // Adjusted field name to match form
         qty,
         total_freight,
         pick_up_date, // Adjusted field name to match form
         expected_delivery_date,
         comments, // Added comments field
         latestUpdate: new Date(), // Can be used to track the latest update timestamp
         longitude: longitude, // Assuming this is optional
         lattitude: lattitude// Optional, depending on whether you handle images
      });

      // Save the consignment to the database
      const savedConsignment = await newConsignment.save();

      if (!savedConsignment) {
         console.log('errrrrrrrrrrrrrrrooooooooooooooooooooorrrrrrrr')
      }

      // Respond with the saved consignment details
      return res.status(200).json({
         response: savedConsignment
      });

   } catch (error) {
      console.log(error);
      error.message = error.message || "An error occurred. Please try again later.";
      return next(error);
   }
}


module.exports.updateCosignment = async (req, res, next) => {
   try {
      let CosignmentId = req.params.id;

      // Fetching details from the request object
      let {
         payment_mode,
         carrier,
         destination,
         shipment_mode, // Adjusted to match form field names
         origin,
         package, // Adjusted to match package field name
         status,
         shipper_name,
         shipper_phoneNumber,
         shipper_address,
         shipper_email,
         receiver_name,
         receiver_email,
         receiver_phoneNumber,
         receiver_address,
         weight,
         product,
         departure_time,
         pick_up_time, // Adjusted field name to match form
         qty,
         total_freight,
         pick_up_date, // Adjusted field name to match form
         expected_delivery_date,
         comments, // Added from form
         longitude,
         lattitude,
         type_of_shipment
      } = req.body;

      // Find the consignment by its ID
      let cosignment = await Cosignment.findOne({ _id: CosignmentId });

      if (!cosignment) {
         let error = new Error("Consignment not found");
         return next(error);
      }

      // Update consignment fields if provided (with default values for missing fields)
      cosignment.payment_mode = payment_mode || cosignment.payment_mode;
      cosignment.carrier = carrier || cosignment.carrier;
      cosignment.destination = destination || cosignment.destination;
      cosignment.shipment_mode = shipment_mode || cosignment.shipment_mode;
      cosignment.origin = origin || cosignment.origin;
      cosignment.package = package || cosignment.package;
      cosignment.status = status || cosignment.status;
      cosignment.shipper_name = shipper_name || cosignment.shipper_name;
      cosignment.shipper_phoneNumber = shipper_phoneNumber || cosignment.shipper_phoneNumber;
      cosignment.shipper_address = shipper_address || cosignment.shipper_address;
      cosignment.shipper_email = shipper_email || cosignment.shipper_email;
      cosignment.receiver_name = receiver_name || cosignment.receiver_name;
      cosignment.receiver_email = receiver_email || cosignment.receiver_email;
      cosignment.receiver_phoneNumber = receiver_phoneNumber || cosignment.receiver_phoneNumber;
      cosignment.receiver_address = receiver_address || cosignment.receiver_address;
      cosignment.weight = weight || cosignment.weight;
      cosignment.product = product || cosignment.product;
      cosignment.departure_time = departure_time || cosignment.departure_time;
      cosignment.pick_up_time = pick_up_time || cosignment.pick_up_time;
      cosignment.qty = qty || cosignment.qty;
      cosignment.total_freight = total_freight || cosignment.total_freight;
      cosignment.pick_up_date = pick_up_date || cosignment.pick_up_date;
      cosignment.expected_delivery_date = expected_delivery_date || cosignment.expected_delivery_date;
      cosignment.comments = comments || cosignment.comments;
  cosignment.type_of_shipment = type_of_shipment || cosignment.type_of_shipment
      // Handling latitude and longitude as numbers if provided
      cosignment.longitude = longitude ? longitude : cosignment.longitude;
      cosignment.lattitude = lattitude ? lattitude : cosignment.lattitude;

      // Save the updated consignment
      let savedCosignment = await cosignment.save();

      if (!savedCosignment) {
         let error = new Error("An error occurred while updating the consignment.");
         return next(error);
      }

      // Respond with the updated consignment details
      return res.status(200).json({
         response: savedCosignment,
      });

   } catch (error) {
      console.error(error);
      error.message = error.message || "An error occurred. Please try again later.";
      return next(error);
   }
};

module.exports.sendEmail = async (req, res, next) => {
   try {

      let { email, message } = req.body
      // Create mailjet send email
      const mailjet = Mailjet.apiConnect(process.env.MAILJET_APIKEY, process.env.MAILJET_SECRETKEY
      )

      //kargoofreight@kargoofreight.cloud

      //kargoofreight@kargoofreight.cloud

      const request = await mailjet.post("send", { 'version': 'v3.1' })
         .request({
            "Messages": [
               {
                  "From": {
                     "Email": "kargoofreight@kargoofreight.cloud",
                     "Name": "kargoofreight.cloud"
                  },
                  "To": [
                     {
                        "Email": `${email}`,
                        "Name": `${email}`
                     }
                  ],
                  "Subject": "SHIPPMENT ARRIVAL",
                  "TextPart": ``,
                  "HTMLPart": shipmentMessage(message)
               }
            ]
         })


      if (!request) {
         let error = new Error("could not verify.Try later")
         return next(error)
      }


      return res.status(200).json({
         response: 'successfully sent!'
      })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}


module.exports.getHistories = async (req, res, next) => {
   try {

      console.log(req.params)
      let History_ = await History.find({ cosignment: req.params.id })
      console.log(History_)
      if (!History_) {
         let error = new Error("An error occured")
         return next(error)
      }
      return res.status(200).json({
         response: History_
      })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}


module.exports.newHistory = async (req, res, next) => {
   try {
      let {
         date,
         time,
         location,
         lattitude,
         longitude,
         status,
         UploadedBy,
         Remarks,
         cossignment
      } = req.body;



      // Create a new consignment object with the provided data
      const newHistory = new History({
         date: date,
         time: time,
         location: location,
         lattitude: lattitude,
         longitude: longitude,
         status: status,
         updatedBy: UploadedBy,
         remarks: Remarks,
         cosignment: cossignment
      });


      // Save the consignment to the database
      const savedHistory = await newHistory.save();


      if (!savedHistory) {
         console.log('errrrrrrrrrrrrrrrooooooooooooooooooooorrrrrrrr')
      }

      // Respond with the saved consignment details
      return res.status(200).json({
         response: savedHistory
      });

   } catch (error) {
      error.message = error.message || "An error occurred. Please try again later.";
      return next(error);
   }
}


module.exports.updateHistory = async (req, res, next) => {
   try {
      // Fetching details from the request object
      let {
         _id,
         date,
         time,
         location,
         lattitude,
         longitude,
         status,
         updatedBy,
         remarks,
      } = req.body;



      // Find the consignment by its ID
      let history = await History.findOne({ _id: _id });

      if (!history) {
         let error = new Error("history not found");
         return next(error);
      }


      history.date =  date? date: history.date
      history.time = time? time : history.time
      history.location = location? location: history.location
      history.lattitude = lattitude? lattitude : history.lattitude
      history.longitude = longitude? longitude : history.longitude
      history.status = status? status :history.status
      history.updatedBy = updatedBy? updatedBy: history.updatedBy
      history.remarks = remarks?remarks:history.remarks
      history.UpdatedBy = history.UpdatedBy

      // Save the updated consignment
      let savedHistory = await history.save();

      if (!savedHistory) {
         let error = new Error("An error occurred while updating the history.");
         return next(error);
      }

      // Respond with the updated consignment details
      return res.status(200).json({
         response:savedHistory
      });

   } catch (error) {
      console.error(error);
      error.message = error.message || "An error occurred. Please try again later.";
      return next(error);
   }
};











