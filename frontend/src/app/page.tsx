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
  CalendarOutlined, 
  RightOutlined,
  CheckCircleOutlined,
  VideoCameraOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { useMeetings } from '../hooks/useMeetings';

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
    <Layout style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Header style={{ 
        background: 'rgba(255, 255, 255, 0.8)', 
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        height: 64
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: '#6366f1', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <VideoCameraOutlined style={{ color: 'white', fontSize: 18 }} />
          </div>
          <Title level={4} style={{ margin: 0, letterSpacing: '-0.5px' }}>MeetNotes</Title>
        </div>
        
        <Space size={16}>
          <Input 
            prefix={<SearchOutlined style={{ color: '#9ca3af' }} />} 
            placeholder="Quick search..." 
            variant="filled"
            style={{ width: 240, borderRadius: 8 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setShowAddModal(true)}
            style={{ borderRadius: 8 }}
          >
            New Meeting
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: '48px 40px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: 40 }}>
          <Title level={2} style={{ margin: 0, fontWeight: 700 }}>All Meetings</Title>
          <Text type="secondary">Review and manage your team synchronizations.</Text>
        </div>

        <Spin spinning={loading} description="Loading schedule...">
          {error ? (
            <Card style={{ borderColor: '#fee2e2', background: '#fef2f2' }}>
              <Text type="danger">{error}</Text>
            </Card>
          ) : filteredMeetings.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
              {filteredMeetings.map((meeting) => {
                const totalActions = meeting.action_items?.length || 0;
                const completedActions = meeting.action_items?.filter(a => a.status === 'done').length || 0;
                const pendingActions = totalActions - completedActions;

                return (
                  <Link key={meeting.id} href={`/meetings/${meeting.id}`}>
                    <Card 
                      hoverable 
                      style={{ 
                        borderRadius: 16, 
                        border: '1px solid #e5e7eb',
                        height: '100%',
                        transition: 'all 0.2s ease'
                      }}
                      styles={{ body: { padding: 24 } }}
                    >
                      <Space orientation="vertical" size={20} style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Tag variant="filled" color="processing" style={{ borderRadius: 6 }}>
                            {new Date(meeting.date_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </Tag>
                          <RightOutlined style={{ color: '#d1d5db' }} />
                        </div>

                        <div>
                          <Title level={4} style={{ margin: '0 0 8px 0', fontSize: 18 }}>{meeting.title}</Title>
                          <Text type="secondary" ellipsis style={{ display: 'block', fontSize: 13, minHeight: 20 }}>
                            {meeting.notes || 'No summary provided.'}
                          </Text>
                        </div>

                        <div style={{ height: '1px', background: '#f3f4f6', width: '100%' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Space size={4} wrap>
                            <Tag variant="filled" color="default" style={{ fontSize: 10, margin: 0 }}>{totalActions} Total</Tag>
                            {completedActions > 0 && (
                              <Tag variant="filled" color="success" icon={<CheckCircleOutlined style={{ fontSize: 10 }} />} style={{ fontSize: 10, margin: 0 }}>{completedActions} Done</Tag>
                            )}
                            {pendingActions > 0 && (
                              <Tag variant="filled" color="warning" icon={<ExclamationCircleOutlined style={{ fontSize: 10 }} />} style={{ fontSize: 10, margin: 0 }}>{pendingActions} Pending</Tag>
                            )}
                          </Space>
                          <Text type="secondary" style={{ fontSize: 11 }}>
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
            <Empty description="No meetings scheduled." style={{ padding: '80px 0' }} />
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
        <Space orientation="vertical" size={20} style={{ width: '100%' }}>
          <div>
            <Text strong style={{ fontSize: 13, color: '#374151' }}>Meeting Topic</Text>
            <Input 
              autoFocus
              placeholder="e.g. Frontend Architecture Sync" 
              style={{ marginTop: 8, borderRadius: 8, height: 40 }}
              value={newMeetingTitle}
              onChange={(e) => setNewMeetingTitle(e.target.value)}
            />
          </div>
          <div>
            <Text strong style={{ fontSize: 13, color: '#374151' }}>Short Description</Text>
            <TextArea 
              rows={4}
              placeholder="Notes, goals or agenda items..." 
              style={{ marginTop: 8, borderRadius: 8 }}
              value={newMeetingNotes}
              onChange={(e) => setNewMeetingNotes(e.target.value)}
            />
          </div>
        </Space>
      </Modal>
    </Layout>
  );
}
