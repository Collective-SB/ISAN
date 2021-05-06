module.exports.split=(str)=>{
    if (str.includes('\r')){
        return str.split('\r\n');
    } else {
        return str.split('\n');
    }
}