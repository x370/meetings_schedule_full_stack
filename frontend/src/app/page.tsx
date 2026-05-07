'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  Input,
  Modal,
  Card,
  Typography,
  Space,
  Empty,
  Spin,
  App,
  Tag,
  Layout
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  RightOutlined,
  CheckCircleOutlined,
  VideoCameraOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { useMeetings } from '../hooks/useMeetings';
import styles from './dashboard.module.css';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Header, Content } = Layout;

export default function Home() {
  const { message } = App.useApp();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMeetingTitle, setNewMeetingTitle] = useState('');
  const [newMeetingNotes, setNewMeetingNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { meetings, loading, error, addMeeting } = useMeetings();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddMeeting = async () => {
    if (!newMeetingTitle.trim()) {
      message.warning('Title is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await addMeeting(newMeetingTitle, newMeetingNotes);
      message.success('Meeting created');
      setNewMeetingTitle('');
      setNewMeetingNotes('');
      setShowAddModal(false);
    } catch (err) {
      message.error('Error creating meeting');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMeetings = meetings.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!mounted) return null;

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.logoContainer}>
          <div className={styles.logoIcon}>
            <VideoCameraOutlined style={{ color: 'white', fontSize: 18 }} />
          </div>
          <Title level={4} className={styles.logoText}>MeetNotes</Title>
        </div>

        <Space size={16}>
          <Input
            prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
            placeholder="Quick search..."
            variant="filled"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setShowAddModal(true)}
            className={styles.newMeetingBtn}
          >
            New Meeting
          </Button>
        </Space>
      </Header>

      <Content className={styles.content}>
        <div className={styles.sectionHeader}>
          <Title level={2} className={styles.sectionTitle}>All Meetings</Title>
          <Text type="secondary">Review and manage your team synchronizations.</Text>
        </div>

        <Spin spinning={loading} description="Loading schedule...">
          {error ? (
            <Card className={styles.errorCard}>
              <Text type="danger">{error}</Text>
            </Card>
          ) : filteredMeetings.length > 0 ? (
            <div className={styles.gridContainer}>
              {filteredMeetings.map((meeting) => {
                const totalActions = meeting.action_items?.length || 0;
                const completedActions = meeting.action_items?.filter(a => a.status === 'done').length || 0;
                const pendingActions = totalActions - completedActions;

                return (
                  <Link key={meeting.id} href={`/meetings/${meeting.id}`}>
                    <Card
                      hoverable
                      className={styles.meetingCard}
                      styles={{ body: { padding: 24 } }}
                    >
                      <Space orientation="vertical" size={20} className={styles.cardContent}>
                        <div className={styles.cardHeader}>
                          <Tag variant="filled" color="processing" className={styles.dateTag}>
                            {new Date(meeting.date_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </Tag>
                          <RightOutlined style={{ color: '#d1d5db' }} />
                        </div>

                        <div>
                          <Title level={4} className={styles.meetingTitle}>{meeting.title}</Title>
                          <Text type="secondary" ellipsis className={styles.meetingNotes}>
                            {meeting.notes || 'No summary provided.'}
                          </Text>
                        </div>

                        <div className={styles.divider} />

                        <div className={styles.cardFooter}>
                          <Space size={4} wrap>
                            <Tag variant="filled" color="default" className={styles.actionTag}>{totalActions} Total</Tag>
                            {completedActions > 0 && (
                              <Tag variant="filled" color="success" icon={<CheckCircleOutlined style={{ fontSize: 10 }} />} className={styles.actionTag}>{completedActions} Done</Tag>
                            )}
                            {pendingActions > 0 && (
                              <Tag variant="filled" color="warning" icon={<ExclamationCircleOutlined style={{ fontSize: 10 }} />} className={styles.actionTag}>{pendingActions} Pending</Tag>
                            )}
                          </Space>
                          <Text type="secondary" className={styles.timeText}>
                            {new Date(meeting.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Text>
                        </div>
                      </Space>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <Empty description="No meetings scheduled." className={styles.emptyState} />
          )}
        </Spin>
      </Content>

      <Modal
        title="New Meeting Details"
        open={showAddModal}
        onCancel={() => setShowAddModal(false)}
        onOk={handleAddMeeting}
        confirmLoading={isSubmitting}
        okText="Save Meeting"
        width={480}
        styles={{ header: { padding: '20px 24px' }, body: { padding: '24px' } }}
      >
        <Space orientation="vertical" size={20} className={styles.cardContent}>
          <div>
            <Text strong className={styles.modalLabel}>Meeting Topic</Text>
            <Input
              autoFocus
              placeholder="e.g. Frontend Architecture Sync"
              className={styles.modalInput}
              value={newMeetingTitle}
              onChange={(e) => setNewMeetingTitle(e.target.value)}
            />
          </div>
          <div>
            <Text strong className={styles.modalLabel}>Short Description</Text>
            <TextArea
              rows={4}
              placeholder="Notes, goals or agenda items..."
              className={styles.modalTextarea}
              value={newMeetingNotes}
              onChange={(e) => setNewMeetingNotes(e.target.value)}
            />
          </div>
        </Space>
      </Modal>
    </Layout>
  );
}
