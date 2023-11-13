import Viewer from "@/components/InfoPlatform/Viewer/detailView"
import { useMatch } from "@umijs/max"


const viewer = ()=>{
  const match = useMatch('/view/:type/:id')
  const type = match?.params?.type
  const entityId = match?.params?.id
  console.log('_id',entityId,'type',type)
  return (type&&entityId)&&<Viewer type={type} id={entityId} />
  || <p>url missing props type:{type} id:{entityId}</p>
}
export default viewer