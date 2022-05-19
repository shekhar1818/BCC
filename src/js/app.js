App = {
  loading: false,
  contracts: {},  
  load: async () => {

    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    //var Web3 = require('web3')  ;  
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {

      //web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        App.acc=await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = App.acc[0];  
    //window.alert(App.account);
   
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const Sample = await $.getJSON('College.json')
    App.contracts.Sample = TruffleContract(Sample)
    App.contracts.Sample.setProvider(App.web3Provider)
    // Hydrate the smart contract with values from the blockchain
    App.college = await App.contracts.Sample.deployed();
  },
  register :async()=>{

    var role=$("#selectrole").val(); 
    var uname=$("#uname").val();
    var uemail=$("#uemail").val();
    var uphno=$("#uphno").val();
    await App.college.addUser(uname,uemail,uphno,role,{from:App.account});
    await App.render();

  },
  render: async () => { 

    
    var role= await App.college.roles(App.account);
    //window.alert(role);

    var admin=await App.college.admin();
    
    if(admin.toString().toUpperCase()==App.account.toString().toUpperCase()){

        window.alert(admin);
 
        var totalUsers=await App.college.totalUsers();
        var count=parseInt(totalUsers);
       $("#displayusers").empty();
        for(var i=1;i<=count;i++){
          var user=await App.college.users(parseInt(i));
          var str="<tr><td>"+user[0]+"</td><td>"+user[1]+"</td><td>"+user[2]+"</td><td>"+user[3]+"</td></tr>";
          $("#dispUsers").append(str);
        }


        $("#signupPage").hide();
        $("#studentdashboard").hide();
        $("#teacherdashboard").hide();
        $("#officedashboard").hide();
        $("#adminD").show();
        
        

    }

    else if(role=="1"){

      userInfo=await App.college.getUserInfo(App.account);
      $("#dispSname").html(userInfo[0]);
      $("#dispSemail").html(userInfo[1]);
      $("#dispSphone").html(userInfo[2]);

        $("#signupPage").hide();
        $("#studentdashboard").show();
        $("#teacherdashboard").hide();
        $("#officedashboard").hide();
        $("#adminD").hide();

  }
  else if(role=="2"){


    userInfo=await App.college.userInfo(App.account);
    $("#dispTname").html(userInfo[0]);
    $("#dispTemail").html(userInfo[1]);
    $("#dispTphone").html(userInfo[2]);

    $("#signupPage").hide();
    $("#studentdashboard").hide();
    $("#teacherdashboard").show();
    $("#officedashboard").hide();
    $("#adminD").hide();

  }

  else if(role=="3"){

    userInfo=await App.college.userInfo(App.account);
    $("#dispOname").html(userInfo[0]);
    $("#dispOemail").html(userInfo[1]);
    $("#dispOphone").html(userInfo[2]);

    $("#signupPage").hide();
    $("#studentdashboard").hide();
    $("#teacherdashboard").hide();
    $("#officedashboard").show();
    $("#adminD").hide();
    
  }
  else{

    $("#signupPage").show();
    $("#studentdashboard").hide();
    $("#teacherdashboard").hide();
    $("#officedashboard").hide();
    $("#adminD").hide();
    
    
  }
    
  } 
  

}



