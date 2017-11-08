var express = require('express');
var router = express.Router();
//database connection

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var config = {
server: '\localhost',
userName: 'sa',
password: 'kokou2008'
,options: {
database: '680'
//rowCollectionOnDone : true,
//useColumnNames : true,
}};

//all the field for filter and search
router.get('/', function(req, res) {
  console.log("here");
  var results = [];
   var connection = new Connection(config);
    connection.on('connect', function(err) {
      if(err){
        console.log(err);
      } else {
        console.log('connected!');
        var r = new Request("select *,CASE  WHEN [TENURE_DEC_YR_MO] = '' THEN 'N/A' WHEN [TENURE_DEC_YR_MO] < 201700 THEN 'Already' ELSE [TENURE_DEC_YR_MO] END as tenure from [680].[dbo].[Salary] where JOB_TITLE like '%Faculty%'", function(){
          //res.set({ 'Expires' : new Date(Date.;now() + 900000) })
          //console.log(results);
          res.json(results);
          });
          r.on("row",function(row){
            var rowdata = new Object();
            row.forEach(function(column) {
              rowdata[column.metadata.colName] = column.value;
            });
            results.push(rowdata);
          });
        this.execSql(r);
      }
  });
});

// Data for graphing per year
router.get('/year', function(req, res) {
  console.log("in year ");
  var results = [];
   var connection = new Connection(config);
    connection.on('connect', function(err) {
      if(err){
        console.log(err);
      } else {
        console.log('connected!');
        var r = new Request("select EMPT_YEAR AS YEAR, SUM(ANNUAL_BASE_AMT) AS AMT FROM [680].[dbo].[Salary] where JOB_TITLE like '%Faculty%' AND EMPT_YEAR BETWEEN '2000' AND '2017' GROUP BY EMPT_YEAR ORDER BY EMPT_YEAR", function(){
          //res.set({ 'Expires' : new Date(Date.now() + 900000) })
          console.log(results);
          res.json(results);
          });
          r.on("row",function(row){
            var rowdata = new Object();
            row.forEach(function(column) {
              rowdata[column.metadata.colName] = column.value;
            });
            results.push(rowdata);
          });
        this.execSql(r);
      }
  });
});

//data for graphing per department
router.get('/department', function(req, res) {
 var results = [];
   var connection = new Connection(config);
    connection.on('connect', function(err) {
      if(err){
        console.log(err);
      } else {
        console.log('connected!');
        var r = new Request("select distinct [LONG_DESC] as dept from [680].[dbo].[Salary]", function(){
          //res.set({ 'Expires' : new Date(Date.now() + 900000) })
          //console.log(results);
          res.json(results);
          });
          r.on("row",function(row){
            var rowdata = new Object();
            row.forEach(function(column) {
              rowdata[column.metadata.colName] = column.value;
            });
            results.push(rowdata);
          });
        this.execSql(r);
      }
  });
});

router.get('/dept', function(req, res) {
 var results = [];
   var connection = new Connection(config);
    connection.on('connect', function(err) {
      if(err){
        console.log(err);
      } else {
        console.log('connected!');
        var r = new Request("select LONG_DESC AS dept, SUM(ANNUAL_BASE_AMT) AS AMT FROM [680].[dbo].[Salary] where JOB_TITLE like '%Faculty%'GROUP BY LONG_DESC", function(){
          //res.set({ 'Expires' : new Date(Date.now() + 900000) })
          console.log(results)
          res.json(results);
          });
          r.on("row",function(row){
            var rowdata = new Object();
            row.forEach(function(column) {
              rowdata[column.metadata.colName] = column.value;
            });
            results.push(rowdata);
          });
        this.execSql(r);
      }
  });
});

//data for graphing per division
router.get('/div', function(req, res) {
 var results = [];
   var connection = new Connection(config);
    connection.on('connect', function(err) {
      if(err){
        console.log(err);
      } else {
        console.log('connected!');
        var r = new Request("select [COL_DIV_CODE] AS div, SUM(ANNUAL_BASE_AMT) AS AMT FROM [680].[dbo].[Salary] GROUP BY [COL_DIV_CODE]", function(){
          //res.set({ 'Expires' : new Date(Date.now() + 900000) })
          console.log(results);
          res.json(results);
          });
          r.on("row",function(row){
            var rowdata = new Object();
            row.forEach(function(column) {
              rowdata[column.metadata.colName] = column.value;
            });
            results.push(rowdata);
          });
        this.execSql(r);
      }
  });
});

//data for getting min max and avg
router.get('/:id', function(req, res) {
  var id = req.params.id;
  console.log(id);
  var results = [];
   var connection = new Connection(config);
    connection.on('connect', function(err) {
      if(err){
        console.log(err);
      } else {
        console.log('connected!');
        var r = new Request("select min(ANNUAL_BASE_AMT) as min ,max(ANNUAL_BASE_AMT) as max,avg(ANNUAL_BASE_AMT) as avg from [680].[dbo].[Salary] where LONG_DESC =@unit", function(){
          //res.set({ 'Expires' : new Date(Date.now() + 900000) })
          console.log(results)
          res.json(results);
        });
          r.addParameter('unit', TYPES.VarChar, id);
          r.on("row",function(row){
            var rowdata = new Object();
            row.forEach(function(column) {
              rowdata[column.metadata.colName] = column.value;
            });
            results.push(rowdata);
          });
        this.execSql(r);
      }
  });
});


module.exports = router;
