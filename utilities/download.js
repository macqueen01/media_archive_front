const fs = require('fs')
const youtubedl = require('youtube-dl')

 
const video = youtubedl('https://www.youtube.com/watch?v=T2a8i8BKV60&t=9s',
  // Optional arguments passed to youtube-dl.
  ['--format=18'],
)
 
// Will be called when the download starts.
video.on('info', function(info) {
  console.log('Download started')
  console.log('filename: ' + info._filename)
  console.log('size: ' + info.size)
})
 
video.pipe(fs.createWriteStream(`/mnt/c/Users/NAMA/Desktop/SampleVideos/${info_filename}.mp4`))
