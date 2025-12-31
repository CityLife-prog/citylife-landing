import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, projectId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Get messages from database
    const userMessages = await db.getMessages(userId as string, projectId as string);

    // Group messages by conversation (project + participants)
    const conversations = userMessages.reduce((acc: any, msg: any) => {
      const conversationKey = `${msg.project_id}-${[msg.sender_id, msg.recipient_id].sort().join('-')}`;
      
      if (!acc[conversationKey]) {
        acc[conversationKey] = {
          projectId: msg.project_id,
          projectName: msg.project_name,
          participants: [
            { id: msg.sender_id, name: msg.sender_name, email: msg.sender_email },
            { id: msg.recipient_id, name: msg.recipient_name, email: msg.recipient_email }
          ].filter((p, index, self) => self.findIndex(sp => sp.id === p.id) === index),
          messages: [],
          lastMessage: null,
          unreadCount: 0
        };
      }
      
      // Convert database format to frontend format
      const formattedMsg = {
        id: msg.id.toString(),
        senderId: msg.sender_id,
        senderName: msg.sender_name,
        senderEmail: msg.sender_email,
        recipientId: msg.recipient_id,
        recipientName: msg.recipient_name,
        recipientEmail: msg.recipient_email,
        projectId: msg.project_id,
        projectName: msg.project_name,
        subject: msg.subject,
        message: msg.message,
        timestamp: msg.created_at,
        read: !!msg.read
      };
      
      acc[conversationKey].messages.push(formattedMsg);
      
      // Set last message
      if (!acc[conversationKey].lastMessage || 
          new Date(formattedMsg.timestamp) > new Date(acc[conversationKey].lastMessage.timestamp)) {
        acc[conversationKey].lastMessage = formattedMsg;
      }
      
      // Count unread messages for the current user
      if (msg.recipient_id === userId && !msg.read) {
        acc[conversationKey].unreadCount++;
      }
      
      return acc;
    }, {} as any);

    // Convert to array and sort by last message timestamp
    const conversationsList = Object.values(conversations as any).sort((a: any, b: any) => 
      new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
    );

    res.status(200).json({
      success: true,
      conversations: conversationsList,
      totalMessages: userMessages.length
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}