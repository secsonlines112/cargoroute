const mongoose = require("mongoose");
mongoose.connect(process.env.DB_STRING).then(() => {
  //console.log("connected to database")
});

// History Schema
const HistorySchema = new mongoose.Schema({
  date: {
    type: String // Store as string (you can format the time string as needed)
  },
  time: {
    type: String // Store as string (you can format the time string as needed)
  },
  location: {
    type: String
  },
  lattitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  status: {
    type: String
  },
  updatedBy: {
    type: String // This could be the ID or name of the person who updated the status
  },
  remarks: {
    type: String
  },
  cosignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cosignment"
}
});

const CosignmentSchema = new mongoose.Schema({
  origin: {
    type: String,
  },
  package: {
    type: String,
  },
  status: {
    type: String,
  },
  destination: {
    type: String,
  },
  carrier: {
    type: String,
  },
  type_of_shipment: {
    type: String,
  },
  weight: {
    type: String,
  },
  shipment_mode: {
    type: String,
  },
  carrier_reference_no: {
    type: String,
  },
  product: {
    type: String,
  },
  qty: {
    type: String,
  },
  payment_mode: {
    type: String,
  },
  total_freight: {
    type: Number,
  },

  expected_delivery_date: {
    type: String,
  },
  departure_time: {
    type: String,
  },
  pick_up_date: {
    type: String,
  },
  pick_up_time: {
    type: String,
  },
  lattitude: {
    type: String,
  },
  longitude: {
    type: String,
  },
  comments: {
    type: String,
  },
  
 
  shipper_name: { type: String },
  shipper_address: { type: String },
  shipper_phoneNumber: { type: String },
  shipper_email: { type: String },  

  receiver_name: { type: String },
  receiver_address: { type: String },
  receiver_phoneNumber: { type: String },
  receiver_email: { type: String },

  latestUpdate: { type: Date }
});


const AdminSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String
  },
  password: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  registerationNumber: {
    type: String
  },
  address: {
    type: String
  }
});

// Create Models
let Cosignment = new mongoose.model("Cosignment", CosignmentSchema);
let Admin = new mongoose.model("Admin", AdminSchema);
let History = new mongoose.model("History", HistorySchema);

module.exports.Cosignment = Cosignment;
module.exports.Admin = Admin;
module.exports.History = History;

