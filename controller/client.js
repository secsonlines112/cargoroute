const express = require("express")
const Mailjet = require('node-mailjet')
let request = require('request');
const random_number = require("random-number")

const { Cosignment, History } = require("../database/databaseConfig");


module.exports.gethome = async (req, res, next) => {
   res.status(200).render('index')
}

module.exports.trackResult = async (req, res, next) => {
   const { keyword } = req.body

   let trackingData = await Cosignment.findOne({ carrier_reference_no: keyword })
   if (!trackingData) {
      
      return res.render('no-result', {
         msg: 'item not found',
      });
   }

   //fetch all history
   let fetchedHistory = await History.find({cosignment:trackingData._id})

   return res.render('track-result', {
      trackingData,
      fetchedHistory:fetchedHistory 
   });
}

module.exports.getabout = async (req, res, next) => {
   res.status(200).render('about')
}

module.exports.getservices = async (req, res, next) => {
   res.status(200).render('services')
}

module.exports.getcontact = async (req, res, next) => {
   res.status(200).render('contact')
}

module.exports.getgallery = async (req, res, next) => {
   res.status(200).render('gallery')
}

module.exports.track = async (req, res, next) => {
   res.status(200).render('track')
}


















