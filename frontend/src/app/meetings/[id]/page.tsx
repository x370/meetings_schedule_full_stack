'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Button,
  Card,
  Typography,
  Space,
  Input,
  Checkbox,
  Spin,
  App,
  Layout,
  Tag,
  Popconfirm
} from 'antd';
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  CheckSquareOutlined,
  VideoCameraOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useMeeting } from '../../../hooks/useMeetings';
import { useActionItems } from '../../../hooks/useActionItems';
import styles from './meetings.module.css';

const { Title, Text, Paragraph } = Typography;
const { Header, Content } = Layout;

export default function MeetingDetails() {
  const { message } = App.useApp();
  const { id } = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [newAction, setNewAction] = useState('');

  const { meeting, loading, error, setMeeting } = useMeeting(id as string);
  const { addActionItem, toggleActionStatus, deleteActionItem, loading: isAddingAction } = useActionItems();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddAction = async () => {
    if (!newAction.trim() || !meeting) return;

    try {
      const newItem = await addActionItem(id as string, newAction);
      setMeeting({
        ...meeting,
        action_items: [...(meeting.action_items || []), newItem]
      });
      setNewAction('');
      message.success('Task added');
    } catch (err) {
      message.error('Failed to add');
    }
  };

  const handleToggleStatus = async (itemId: number) => {
    if (!meeting) return;

    const updatedItems = meeting.action_items.map((item: any) =>
      item.id === itemId ? { ...item, status: 'done' } : item
    );
    setMeeting({ ...meeting, action_items: updatedItems });

    const success = await toggleActionStatus(itemId);
    if (!success) {
      message.error('Update failed');
    }
  };

  const handleDeleteAction = async (itemId: number) => {
    if (!meeting) return;

    const success = await deleteActionItem(itemId);
    if (success) {
      const updatedItems = meeting.action_items.filter((item: any) => item.id !== itemId);
      setMeeting({ ...meeting, action_items: updatedItems });
      message.success('Task deleted');
    } else {
      message.error('Delete failed');
    }
  };

  if (!mounted) return null;

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.logoContainer} onClick={() => router.push('/')}>
          <div className={styles.logoIcon}>
            <VideoCameraOutlined style={{ color: 'white', fontSize: 18 }} />
          </div>
          <Title level={4} className={styles.logoText}>MeetNotes</Title>
        </div>
      </Header>

      <Content className={styles.content}>
        <Button
          type="link"
          size="small"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push('/')}
          className={styles.backBtn}
        >
          Back to list
        </Button>

        {loading ? (
          <div className={styles.loaderContainer}>
            <Spin size="large" description="Loading meeting details..." />
          </div>
        ) : error || !meeting ? (
          <Card className={styles.errorCard}>
            <Text type="danger">Meeting not found</Text>
          </Card>
        ) : (
          <Space orientation="vertical" size={32} className={styles.mainSpace}>
            <div className={styles.headerInfo}>
              <div>
                <Tag variant="filled" color="indigo" className={styles.sessionTag}>Meeting Session</Tag>
                <Title level={1} className={styles.meetingTitle}>{meeting.title}</Title>
                <Space size={16} className={styles.metaInfo}>
                  <Text type="secondary"><CalendarOutlined /> {new Date(meeting.date_time).toLocaleDateString()}</Text>
                  <Text type="secondary"><ClockCircleOutlined /> {new Date(meeting.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </Space>
              </div>
            </div>

            <div className={styles.detailGrid}>
              <div className={styles.notesColumn}>
                <Card title={<Text strong>Meeting Notes</Text>} className={styles.notesCard}>
                  <Paragraph className={styles.notesParagraph}>
                    {meeting.notes || 'No notes were taken for this meeting.'}
                  </Paragraph>
                </Card>
              </div>

              <div className={styles.tasksColumn}>
                <Card
                  title={<Text strong><CheckSquareOutlined /> Action Items</Text>}
                  className={styles.tasksCard}
                  styles={{ body: { padding: '20px' } }}
                >
                  <Space.Compact className={styles.taskInputCompact}>
                    <Input
                      placeholder="New task..."
                      value={newAction}
                      onChange={(e) => setNewAction(e.target.value)}
                      onPressEnter={handleAddAction}
                      className={styles.taskInput}
                    />
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleAddAction}
                      loading={isAddingAction}
                      className={styles.taskAddBtn}
                    />
                  </Space.Compact>

                  <div className={styles.taskList}>
                    {(meeting.action_items || []).length > 0 ? (
                      meeting.action_items.map((item: any) => (
                        <div key={item.id} className={styles.taskItem}>
                          <Checkbox
                            checked={item.status === 'done'}
                            onChange={() => item.status !== 'done' && handleToggleStatus(item.id)}
                            className={styles.taskCheckbox}
                          />
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <Text
                              delete={item.status === 'done'}
                              className={`${styles.taskDescription} ${item.status === 'done' ? styles.taskDone : ''}`}
                            >
                              {item.description}
                            </Text>
                            <Popconfirm
                              title="Delete this task?"
                              onConfirm={() => handleDeleteAction(item.id)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <DeleteOutlined style={{ color: '#ff4d4f', cursor: 'pointer', marginLeft: 8 }} />
                            </Popconfirm>
                          </div>
                        </div>
                      ))
                    ) : (
                      <Text type="secondary" className={styles.emptyTasks}>
                        No follow-up tasks yet.
                      </Text>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </Space>
        )}
      </Content>
    </Layout>
  );
}
