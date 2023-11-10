import { Around } from "@/components/InfoPlatform/Maps/Around";
import { PosChooser, WHUCSCoords, WHUCoords } from "@/components/InfoPlatform/Maps/PosChooser";
import { Col } from "antd";

export default ()=>{

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

  return <Col>
    <PosChooser setPos={()=>null} initialPos={WHUCSCoords}/>
    <Around objects={randomMarker(100)} />
  </Col>
};