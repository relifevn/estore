
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: 'b-ch-khoa-university',
    api_key: '532468687251448',
    api_secret: 'vvGWFDRaTTsOYKr1TzxZ0_5Zyc8',
})

class CloudinaryService {

    /**
     * @param {string} fileBase64 
     * @param {string} folderName
     */
    static async uploadFile(fileBase64, folderName) {
        return cloudinary.uploader.upload(fileBase64, {
            folder: folderName,
        })
    }

}

module.exports = {
    CloudinaryService,
}