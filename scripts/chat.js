// WayFair Chat Service Module

class ChatService {
    constructor() {
        this.conversations = this.loadConversations();
        this.messages = this.loadMessages();
        this.currentUser = auth.getCurrentUser();
    }

    // Start conversation
    startConversation(user1Id, user2Id) {
        const conversationId = this.generateConversationId(user1Id, user2Id);
        
        let conversation = this.conversations.find(c => c.id === conversationId);
        if (!conversation) {
            conversation = {
                id: conversationId,
                participants: [user1Id, user2Id],
                createdAt: new Date(),
                lastMessageAt: null,
                lastMessage: null
            };
            this.conversations.push(conversation);
            this.saveConversations();
        }

        return conversation;
    }

    // Send message
    sendMessage(conversationId, senderId, text) {
        const message = {
            id: 'MSG' + Date.now(),
            conversationId,
            senderId,
            text,
            createdAt: new Date(),
            read: false,
            attachments: []
        };

        this.messages.push(message);

        // Update conversation
        const conversation = this.conversations.find(c => c.id === conversationId);
        if (conversation) {
            conversation.lastMessageAt = new Date();
            conversation.lastMessage = text;
        }

        this.saveConversations();
        this.saveMessages();

        // Notify
        this.notifyNewMessage(message);

        return message;
    }

    // Get conversation messages
    getConversationMessages(conversationId) {
        return this.messages.filter(m => m.conversationId === conversationId)
                            .sort((a, b) => a.createdAt - b.createdAt);
    }

    // Get user conversations
    getUserConversations(userId) {
        return this.conversations.filter(c => c.participants.includes(userId))
                                 .sort((a, b) => b.lastMessageAt - a.lastMessageAt);
    }

    // Mark as read
    markAsRead(messageId) {
        const message = this.messages.find(m => m.id === messageId);
        if (message) {
            message.read = true;
            this.saveMessages();
        }
    }

    // Delete message
    deleteMessage(messageId) {
        const index = this.messages.findIndex(m => m.id === messageId);
        if (index > -1) {
            this.messages.splice(index, 1);
            this.saveMessages();
        }
    }

    // Send typing indicator
    sendTypingIndicator(conversationId, userId) {
        const event = new CustomEvent('userTyping', {
            detail: { conversationId, userId }
        });
        document.dispatchEvent(event);
    }

    // Generate conversation ID
    generateConversationId(user1Id, user2Id) {
        const ids = [user1Id, user2Id].sort();
        return 'CONV-' + ids[0] + '-' + ids[1];
    }

    // Get unread count
    getUnreadCount(userId) {
        const userConversations = this.conversations.filter(c => c.participants.includes(userId));
        let unreadCount = 0;

        userConversations.forEach(conv => {
            const unreadMessages = this.messages.filter(m =>
                m.conversationId === conv.id &&
                m.senderId !== userId &&
                !m.read
            );
            unreadCount += unreadMessages.length;
        });

        return unreadCount;
    }

    // Notify new message
    notifyNewMessage(message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('New Message', {
                body: message.text.substring(0, 50) + '...',
                icon: '../assets/icons/logo.png'
            });
        }
    }

    // Request notification permission
    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    // Block user
    blockUser(userId) {
        const blocklist = JSON.parse(localStorage.getItem('blocklist') || '[]');
        if (!blocklist.includes(userId)) {
            blocklist.push(userId);
            localStorage.setItem('blocklist', JSON.stringify(blocklist));
        }
    }

    // Unblock user
    unblockUser(userId) {
        const blocklist = JSON.parse(localStorage.getItem('blocklist') || '[]');
        const index = blocklist.indexOf(userId);
        if (index > -1) {
            blocklist.splice(index, 1);
            localStorage.setItem('blocklist', JSON.stringify(blocklist));
        }
    }

    // Is user blocked
    isUserBlocked(userId) {
        const blocklist = JSON.parse(localStorage.getItem('blocklist') || '[]');
        return blocklist.includes(userId);
    }

    // Save conversations
    saveConversations() {
        localStorage.setItem('wayfairConversations', JSON.stringify(this.conversations));
    }

    // Load conversations
    loadConversations() {
        const data = localStorage.getItem('wayfairConversations');
        return data ? JSON.parse(data) : [];
    }

    // Save messages
    saveMessages() {
        localStorage.setItem('wayfairMessages', JSON.stringify(this.messages));
    }

    // Load messages
    loadMessages() {
        const data = localStorage.getItem('wayfairMessages');
        return data ? JSON.parse(data) : [];
    }
}

// Initialize chat service
const chatService = new ChatService();
chatService.requestNotificationPermission();
