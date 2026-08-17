import React, { useState } from 'react'
import AWS from 'aws-sdk'

AWS.config.update({
  accessKeyId: '',
  secretAccessKey: ''
})

const myBucket = new AWS.S3({
  params: { Bucket: '' },
  region: ''
})

export default class AwsRequest {
  uploadFile(file) {
    const params = {
      ACL: 'public-read',
      Body: file[0],
      Bucket: '',
      Key: file[0].name
    }

    myBucket.putObject(params).send(err => {
      if (err) console.log(err)
    })
  }
}

// Reference Docs: https://github.com/StevenCreates/react-file-aws
