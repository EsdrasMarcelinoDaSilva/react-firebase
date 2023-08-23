import { useState, useEffect } from 'react'
import * as C from './App.styles'
import * as Photos from './services/photos'
import { Photo } from './types/photo'
import { PhotoItem } from './components/photoItem'


const App = () => {
  const [upLoading, setUpLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [photos, setPhotos] = useState<Array<Photo>>([])

  useEffect(() => {
    const getPhotos = async () => {
      setLoading(true)
      setPhotos(await Photos.getAll())
      setLoading(false)
    }
    getPhotos()
  }, [])

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const file = formData.get('image') as File

    if(file && file.size > 0) {
      setUpLoading(true)
      const result = await Photos.insert(file)
        setUpLoading(false)
        if(result instanceof Error) {
          alert(`${result.name} - ${result.message}`)
        }else {
          const newPhotoList = [...photos]
          newPhotoList.push(result)
          setPhotos(newPhotoList)
        }
      }
    }


  return(
    // <C.ScreenBody>
    <C.Container>
      <C.Area>
        <C.Header>Photo Gallery</C.Header>

        <C.UploadForm method="POST" onSubmit={handleFormSubmit}>
          <input type="file" name="image" />
          <input type="submit" value="Upload" />
          {upLoading && 'Uploading...'}
        </C.UploadForm>

        {loading && 
          <C.ScreenWarning>
            <div className='emoji'>✋</div>
            <div>Loading...</div>
          </C.ScreenWarning>
          }
          {!loading && photos.length > 0 &&
            <C.PhotoList>
              {photos.map((item, index) => (
                <PhotoItem key={index} url={item.url} name={item.name} />
              ))}
            </C.PhotoList>
          }
          {!loading && photos.length === 0 &&
              <C.ScreenWarning>
              <div className='emoji'>😞</div>
              <div>there are no registered photos</div>
            </C.ScreenWarning>
          }
      </C.Area>
    </C.Container>
    // </C.ScreenBody>
  )
}
export default App