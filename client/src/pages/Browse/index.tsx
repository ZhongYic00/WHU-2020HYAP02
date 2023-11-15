import { Button, Card, Typography, Rate, Modal, Form, Input } from 'antd';
import { LikeOutlined, DislikeOutlined, LikeFilled, DislikeFilled } from '@ant-design/icons';
import { useMatch, useModel } from '@umijs/max';
import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';

const { Title, Text } = Typography;
// todo: 查询语句可能有bug？
const CourseQuery = gql`
query CourseQuery($where: TeacherWhere) {
  courses(where: $where) {
    ... on DepartmentCourse {
      _id
      name
    }
    ... on GeneralCourse {
      _id
      name
    }
    ... on LiberalCourse {
      _id
      name
    }
    ... on PECourse {
      _id
      name
    }
  }
}
`

export default () => {
  const match = useMatch('/Browse/:id')
  const entityId = match?.params?.id
  const { loading, error, data } = useQuery(CourseQuery,{  // todo: 目前data返回undefined
    variables: {where: {_id: entityId}}
  });
  // 虚拟的数据
  const courseInfo = {
    title: entityId,  // todo: 改成课程名
    description: '',
  };
  console.log(data)

  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: '汪昊楠',
      rating: 4.5,
      comment: '这门课程我都学过，老师讲得非常符合我的预期。',
      likes: 10,
      dislikes: 2,
    },
    {
      id: 2,
      user: '郑颖灏',
      rating: 3.5,
      comment: '课程内容有些难度，但老师讲得不错。',
      likes: 5,
      dislikes: 1,
    },
    {
      id: 3,
      user: '苏睿懿',
      rating: 0.5,
      comment: '我好菜，根本听不懂。',
      likes: 1,
      dislikes: 10,
    },
    // 其他评价数据
  ]);

  const [visible, setVisible] = useState(false);

  const handleOk = () => {
    // TODO: 将评价信息提交到后端
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleEvaluateClick = () => {
    setVisible(true);
  };

  const onFinish = (values) => {
    const newReview = {
      id: reviews.length + 1,
      user: values.user,
      rating: values.rating,
      comment: values.comment,
      likes: values.likes,
      dislikes: values.dislikes,
    };
    setReviews([...reviews, newReview]);
    setVisible(false);
  };


  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>{courseInfo.title}</Title>
        <Text>{courseInfo.description}</Text>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Button type="primary">返回</Button>
        <Button type="primary" onClick={() => setVisible(true)}>
          评价
        </Button>
      </div>

      {reviews.map((review) => {
        const [likeStatus, setLikeStatus] = useState('none'); // likeStatus 可以是 'like'、'dislike' 或 'none'
        const [likenum, setlike] = useState(review.likes);
        const [dislikenum, setdislike] = useState(review.dislikes);
        const percentage = (review.rating / 5) * 100;
        const hue = percentage * 1.2 / 360; // 将百分比转换为色调值
        const color = `hsl(${hue}, 100%, 50%)`; // 使用 hsl() 函数设置颜色


        const handleLikeClick = () => {
          if (likeStatus === 'like') {
            setLikeStatus('none');
            review.likes -= 1;
            setlike(likenum - 1);
          } else if (likeStatus === 'dislike') {
            setLikeStatus('like');
            review.likes += 1;
            review.dislikes -= 1;
            setlike(likenum + 1);
            setdislike(dislikenum - 1)
          }
          else{
            setLikeStatus('like');
            review.likes += 1;
            setlike(likenum + 1);
          }
        };

        const handleDislikeClick = () => {
            if (likeStatus === 'like') {
              setLikeStatus('dislike');
              review.likes -= 1;
              review.dislikes += 1;
              setlike(likenum - 1);
              setdislike(dislikenum + 1)
              
            } else if (likeStatus === 'dislike') {
                setLikeStatus('none');
                review.dislikes -= 1;
                setdislike(dislikenum - 1);
            }
            else{
              setLikeStatus('dislike');
              review.dislikes += 1;
              setdislike(dislikenum + 1);
            }
          };

        return (
          <Card key={review.id} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Title level={4}>{review.user}</Title>
                <Text style={{ color: `hsl(${percentage}, 100%, 50%)`, fontSize: '20px' }}>{review.rating}</Text>
                <Text style={{ color: `hsl(100, 100%, 50%)`, fontSize: '20px' }}>{'/5'}</Text>
                <Text style={{fontSize: '20px' }}> 分</Text>
                <br />
                <Rate value={review.rating} allowHalf disabled />
              </div>
              <div>
                <Button type="primary" style={{ width: 50 }} icon={likeStatus === 'like' ? <LikeFilled style={{ color: '#ff4d4f' }} /> : <LikeOutlined />} onClick={handleLikeClick} />
                <Text>{likenum}</Text>
                <Button type="primary" style={{ width: 50 }} icon={likeStatus === 'dislike' ? <DislikeFilled style={{ color: '#000000' }} /> : <DislikeOutlined />} onClick={handleDislikeClick} />
                <Text>{dislikenum}</Text>
              </div>
            </div>
            <Text>{review.comment}</Text>
          </Card>
        );
      })}

      {/* 弹窗 */}
      <Modal title="评价" visible={visible} onOk={handleOk} onCancel={handleCancel}>
        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          <Form.Item label="评分">
            <Rate allowHalf />
          </Form.Item>
          <Form.Item label="评论">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
