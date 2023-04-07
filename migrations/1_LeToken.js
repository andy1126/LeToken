const LeToken = artifacts.require("LeToken")

module.exports = function(deployer){
    deployer.deploy(LeToken, 100, 100)
}