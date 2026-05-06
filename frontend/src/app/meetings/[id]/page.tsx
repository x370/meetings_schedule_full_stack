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
  Tag
} from 'antd';
import { 
  ArrowLeftOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined, 
  FileTextOutlined, 
  PlusOutlined, 
  CheckSquareOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import { useMeeting } from '../../../hooks/useMeetings';
import { useActionItems } from '../../../hooks/useActionItems';

const { Title, Text, Paragraph } = Typography;
const { Header, Content } = Layout;

export default function MeetingDetails() {
  const { message } = App.useApp();
  const { id } = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [newAction, setNewAction] = useState('');
  
  const { meeting, loading, error, setMeeting } = useMeeting(id as string);
  const { addActionItem, toggleActionStatus, loading: isAddingAction } = useActionItems();

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
        padding: '0 40px',
        height: 64
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ background: '#6366f1', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <VideoCameraOutlined style={{ color: 'white', fontSize: 18 }} />
          </div>
          <Title level={4} style={{ margin: 0, letterSpacing: '-0.5px' }}>MeetNotes</Title>
        </div>
      </Header>

      <Content style={{ padding: '48px 40px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <Button 
          type="link" 
          size="small"
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.push('/')}
          style={{ color: '#64748b', paddingLeft: 0, marginBottom: 24 }}
        >
          Back to list
        </Button>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Spin size="large" description="Loading meeting details..." />
          </div>
        ) : error || !meeting ? (
          <Card style={{ textAlign: 'center', borderRadius: 16 }}>
            <Text type="danger">Meeting not found</Text>
          </Card>
        ) : (
          <Space orientation="vertical" size={32} style={{ width: '100%' }}>
            {/* Header Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Tag variant="filled" color="indigo" style={{ marginBottom: 12, borderRadius: 6 }}>Meeting Session</Tag>
                <Title level={1} style={{ margin: 0, fontWeight: 800 }}>{meeting.title}</Title>
                <Space size={16} style={{ marginTop: 12 }}>
                  <Text type="secondary"><CalendarOutlined /> {new Date(meeting.date_time).toLocaleDateString()}</Text>
                  <Text type="secondary"><ClockCircleOutlined /> {new Date(meeting.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </Space>
              </div>
            </div>

            {/* Content Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 32 }}>
              {/* Notes Area */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <Card title={<Text strong>Meeting Notes</Text>} style={{ borderRadius: 16, border: '1px solid #e5e7eb' }}>
                  <Paragraph style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, margin: 0 }}>
                    {meeting.notes || 'No notes were taken for this meeting.'}
                  </Paragraph>
                </Card>
              </div>

              {/* Tasks Area */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <Card 
                  title={<Text strong><CheckSquareOutlined /> Action Items</Text>} 
                  style={{ borderRadius: 16, border: '1px solid #e5e7eb' }}
                  styles={{ body: { padding: '20px' } }}
                >
                  <Space.Compact style={{ width: '100%', marginBottom: 20 }}>
                    <Input 
                      placeholder="New task..." 
                      value={newAction}
                      onChange={(e) => setNewAction(e.target.value)}
                      onPressEnter={handleAddAction}
                      style={{ borderRadius: '8px 0 0 8px' }}
                    />
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />} 
                      onClick={handleAddAction}
                      loading={isAddingAction}
                      style={{ borderRadius: '0 8px 8px 0' }}
                    />
                  </Space.Compact>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {(meeting.action_items || []).length > 0 ? (
                      meeting.action_items.map((item: any) => (
                        <div key={item.id} style={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          gap: 12, 
                          padding: '8px 0',
                          borderBottom: '1px solid #f3f4f6'
                        }}>
                          <Checkbox 
                            checked={item.status === 'done'} 
                            onChange={() => item.status !== 'done' && handleToggleStatus(item.id)}
                            style={{ marginTop: 4 }}
                          />
                          <Text delete={item.status === 'done'} style={{ 
                            fontSize: 14, 
                            color: item.status === 'done' ? '#9ca3af' : '#374151' 
                          }}>
                            {item.description}
                          </Text>
                        </div>
                      ))
                    ) : (
                      <Text type="secondary" style={{ fontSize: 13, textAlign: 'center', padding: '12px 0' }}>
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
