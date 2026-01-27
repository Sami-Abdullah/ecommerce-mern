const fs = require('fs').promises;
const deleteImg = async () => {

  try {
    await fs.access(userImagePath)
    await fs.unlink(userImagePath)
    console.log('User image was deleted')
    
  } catch (error) {
    console.error('user image does not exist ')
  }

}
module.exports = deleteImg;