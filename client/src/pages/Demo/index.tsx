import { AbstractIdViewer, AbstractViewer } from '@/components/InfoPlatform/Viewer/abstractView';
import { Link } from '@umijs/max';
import { Table } from 'antd';

const columns = [
  {
    title: '时间',
    dataIndex: 'time',
    width: 100,
  },
  {
    title: '周一',
    dataIndex: 'monday',
    width: 100,
  },
  {
    title: '周二',
    dataIndex: 'tuesday',
    width: 100,
  },
  {
    title: '周三',
    dataIndex: 'wednesday',
    width: 100,
  },
  {
    title: '周四',
    dataIndex: 'thursday',
    width: 100,
  },
  {
    title: '周五',
    dataIndex: 'friday',
    width: 100,
  },
  {
    title: '周六',
    dataIndex: 'saturday',
    width: 100,
  },
  {
    title: '周日',
    dataIndex: 'sunday',
    width: 100,
  },
];

const data = [];
for (let i = 1; i <= 13; i++) {
  data.push({
    key: i,
    time: `${i}`,
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: null,
    friday: '',
    saturday: '',
    sunday: '',
  });
}

data[0].time = '8:00-9:00';
data[1].time = '9:00-10:00';
data[2].time = '10:00-11:00';
data[3].time = '11:00-12:00';
data[4].time = '12:00-13:00';
data[5].time = '13:00-14:00';
data[6].time = '14:00-15:00';
data[7].time = '15:00-16:00';
data[8].time = '16:00-17:00';
data[9].time = '17:00-18:00';
data[10].time = '18:00-19:00';
data[11].time = '19:00-20:00';
data[12].time = '20:00-21:00';

data.forEach((item) => {
  const id='20da47e6-336b-46c9-96bb-e68073d889fa'
  const 机器学习=<Link to={`/view/Class/${id}`}>
    <AbstractIdViewer type='Class' id={id}/>
  </Link>
  if (item.key === 1 || item.key === 2 || item.key === 3) {
    item.monday = 机器学习;
  }
  if (item.key === 6 || item.key === 7) {
    item.thursday = 机器学习;
  }
});

const CourseTable = () => {
  return (
      <Table columns={columns} dataSource={data} bordered pagination={false} />
  );
};

export default CourseTable;
