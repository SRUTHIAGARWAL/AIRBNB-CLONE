const Joi = require("joi");

module.exports.listingScheme=Joi.object({
    listing: Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().required().min(0),
        country:Joi.string().required(),
        image:Joi.string().allow("",null)
    }).required()
});

module.exports.reviewSchema=Joi.object
({
        comment:Joi.string().required(),
        rating:Joi.number().min(1).max(10).required()
})