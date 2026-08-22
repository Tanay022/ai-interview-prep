const mongoose=require('mongoose');

//------------- creating sub-Schemas for interviewReportSchema------//

//---------(1) For Technical Question-----------//
const technicalQuestionSchema = new mongoose.Schema({
    question:{type:String,required:[true,"Technical Questions is Required"]},
    intention:{type:String,required:[true,"Intention is Required"]},
    answer:{type:String,required:[true,"Answer is Required"]},
},{_id:false})

//---------(2) For Behavrioul Question-----------//
const behavioralQuestionSchema = new mongoose.Schema({
    question:{type:String,required:[true,"Behavioral  Questions is Required"]},
    intention:{type:String,required:[true,"Intention is Required"]},
    answer:{type:String,required:[true,"Answer is Required"]},
},{_id:false})

//---------(3) For Skills Gap-----------//
const skillGapSchema=new mongoose.Schema({
    skill:{type:String,required:[true,"skill is required"]},
   severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "Severity is required"]
    }
},{_id:false})

//----------(4) For prepration plan----------//
const preprationPlanSchema=new mongoose.Schema({
    day:{type:Number,required:[true,"day is required"]},
    focus:{type:String,required:[true,"Focus is required"]},
    tasks:{type:[String],required:[true,"Task is required"]}
},{_id:false})
//--------------------------------------------------------------------------------//

//--------Main Schema(jo DB me jaygega)------------//
const interviewReportSchema= new mongoose.Schema({
    jobDescription:{type:String,required:[true,"Job Description is Required"]},
    resume:{type:String},
    selfDescription:{type:String},
    matchScore:{type:Number,min:0,max:100},
    technicalQuestions:[technicalQuestionSchema],
    behavioralQuestions:[behavioralQuestionSchema],
    skillGaps:[skillGapSchema],
    preparationPlan:[preprationPlanSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    title:{type:String,required:[true,"Job title is required"]}
},{timestamps:true})

const interviewReportModel=mongoose.model("InterviewReport",interviewReportSchema);
module.exports=interviewReportModel;