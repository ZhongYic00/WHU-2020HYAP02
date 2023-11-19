import { Around } from "@/components/InfoPlatform/Maps/Around";
import { PosChooser, WHUCSCoords, WHUCoords } from "@/components/InfoPlatform/Maps/PosChooser";
import { abstractFragment } from "@/components/InfoPlatform/Viewer/abstractView";
import { gql, useQuery } from "@apollo/client";
import { Col } from "antd";

export default ()=>{
const toAmapPoint=(p)=>({lng:p.longitude,lat:p.latitude})
const randomLnglat = () => [
  WHUCoords.lng + Math.random() * 0.01-0.005,
  WHUCoords.lat + Math.random() * 0.01-0.005
] as AMap.MarkerCluster.DataOptions['lnglat'];

const randomMarker = (len = 10) => (
  Array(len).fill(true).map((item, index) => ({
    lnglat: randomLnglat(),
    extData: index+'s'
  }))
);
  const curpos=WHUCSCoords
  const {data:ids}=useQuery(gql`
query($lng: Float, $lat: Float){
  around(lng: $lng,lat: $lat){
    id
    loc {
      latitude
      longitude
    }
  }
}
  `,{variables:{
    lng:curpos.lng,lat:curpos.lat,
  }})
  console.log('around',ids)
  const {data:correspondingPosts}=useQuery(gql`
${abstractFragment.POI}
${abstractFragment.Class}
query($where: PostWhere) {
  posts(where: $where) {
    _id
    createdAt
    content {
      _id
      __typename
      ...POIAbstract
      ...ClassAbstract
    }
  }
}
  `,{variables:{
    where:{contentConnection:{node:{_id_IN:ids?.around.map(v=>v.id)}}}
  }})
  const data=correspondingPosts && correspondingPosts.posts.map(p=>{
    const idsItem=(ids?.around as any[]).find(v=>v.id==p.content._id)
    if(!idsItem)throw "error!"
    return {
      lnglat:toAmapPoint(idsItem.loc),
      extData:p.content
    }
  })
  return <Col>
    {/* <PosChooser setPos={()=>null} initialPos={WHUCSCoords}/> */}
    <Around objects={[...(data||[]),...randomMarker(100)]} />
  </Col>
};