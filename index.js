
const mysql = require('mysql');
const config = {};
const config_private = require('./.iddqd1993/config_private');
const sqlcon1 = mysql.createConnection({
    host: config_private.host,
    user: config_private.user,
    password: config_private.password,
    database: config_private.database
    //socketPath: ''socketPath'  
});

sqlcon1.connect(function(err) {
    if (err) {
        console.log('createConnection Error: '+err);
        console.log('Quitting!');
        process.exit();    
    } else {
        console.log('Connected!');
    };
});

function BuildNavMain(SqlConX, access, thisnavid, locale='en', cb){
  var level = 1;
  var isnode = false;
  var navhtml = '<ul id="nav_main">'//<!--li><a class="_amenu"" href="javascript:void(0);">&nbsp;</a></li-->';
  SqlConX.query(`SELECT navid, navname, pagetitle, pageh1, page, paramset, filename, navclass, css3 FROM z_nav WHERE nav_locale ='${locale}'\
  AND navid > 1000000000 AND navid < 2000000000 And (access Is null Or access <= ${access}) ORDER BY navid, navname`,
  function (err, rows, fields) {
    if (err) {
        console.log('010 Query Error: '+err);
        console.log('Quitting!');
        process.exit();
    }
      //console.log("Fields: " + fields);
      rows.forEach(function(row){
          //console.log('NEW ROW: ' + row.navname); 
          if (row.page == null) {isnode = true} else {isnode = false};                  //is (not) a node, add a <ul> link for navigation on touch displays
          switch (level){
              case 1:
                  //console.log(' case 1 ' + level + ' ' + row.navid.toString());       //level1 -> level2
                  if (row.navid.toString().slice(2,6) != '0000') {level = 2;            //console.log(' case 1>2 ' + level);
              }                    
                  break;
              case 2:
                  //console.log(' case 2 ' + level + ' ' + row.navid.toString());       //level2 -> level3
                  if (row.navid.toString().slice(6,10) != '0000') {level = 3;           //console.log(' case 2>3 ' + level);
              } 
                  if (row.navid.toString().slice(4,8) == '0000') {level = 1; navhtml+= `</ul></li>
                  `;
                  //console.log(' case 2>1 ' + level + ' ' + row.navid.toString());     //level2 -> level1  
                  } 
                  break;
              case 3: 
                  //console.log(' case 3 ' + level + ' ' + row.navid.toString());          
                  if (row.navid.toString().slice(6,10) == '0000') {level = 2; navhtml+= `</ul></li>
                  `;
                  //console.log(' case 3>2 ' + level + ' ' + row.navid.toString());     //level3 -> level2
                  }                    
                  if (row.navid.toString().slice(4,8) == '0000') {level = 1; navhtml+= `</ul></li>
                  `;
                  //console.log(' case 2>1 ' + level + ' ' + row.navid.toString());     //level2 -> level1
                  } 
          };
          
          navhtml += '<li class="'
          if (row.navclass != null) {
              navhtml += ' _n' + row.navclass
          } else if (!isnode) {
              navhtml += ' _n' + row.page
          };
          if (isnode) {navhtml += ' _node'}          

          if (thisnavid > row.navid) {
              if (level == 1 && thisnavid - row.navid < 100000000) {navhtml += ' _ispath'};     //current link is a part of current page's path
              if (level == 2 && thisnavid - row.navid < 10000) {navhtml += ' _ispath'};         //current link is a part of current page's path
          } else if (row.navid == thisnavid){navhtml += ' _isthispage'};                        //current link is current page
            
          navhtml += '"><a href="'
          if (isnode) {
              navhtml += 'javascript:void(0);';
          } else if (row.page != '/') {
              navhtml += '/' + row.page + '/';
          } else {
              navhtml += '/'; //je HP
          }          

          if (row.paramset != null) {navhtml += row.paramset} ;             //if paramset in not null, add it (querystrings, anchors)
          
          navhtml += '"><b>' + row.navname + '</b></a>';

          if (isnode){navhtml += "<ul>\n";} else {navhtml += "</li>\n"};    //is a node, add a <ul> link for navigation on touch displays
          //console.log(' >' + level);   
                }); 
       if (level == 3) {navhtml += '</ul></li></ul></li>'};
       if (level == 2) {navhtml += '</ul></li>'};
       navhtml += "</ul>";
       console.log('looping done');
       console.log(navhtml);
       return navhtml;   
  });
};   

console.log('before');
console.log('result:'+BuildNavMain(sqlcon1, 1, 11000000, 'en'));            //ASYNC, so no result here (undefined')!
console.log('after');