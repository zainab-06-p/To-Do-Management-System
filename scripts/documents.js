// WayFair Document Management Service

class DocumentService {
    constructor() {
        this.documents = this.loadDocuments();
        this.allowedFileTypes = ['jpg', 'jpeg', 'png', 'pdf'];
        this.maxFileSize = 5 * 1024 * 1024; // 5MB
    }

    // Upload document
    uploadDocument(userId, documentType, file) {
        // Validate file
        if (!this.validateFile(file)) {
            throw new Error('Invalid file format or size');
        }

        const document = {
            id: 'DOC' + Date.now(),
            userId,
            type: documentType, // 'license', 'id', 'insurance', 'registration'
            fileName: file.name,
            fileSize: file.size,
            uploadedAt: new Date(),
            status: 'pending', // 'pending', 'approved', 'rejected'
            expiryDate: this.calculateExpiryDate(documentType),
            verifiedAt: null,
            verifiedBy: null,
            rejectionReason: null
        };

        // Mock file storage
        this.documents.push(document);
        this.saveDocuments();

        return document;
    }

    // Validate file
    validateFile(file) {
        const extension = file.name.split('.').pop().toLowerCase();
        
        if (!this.allowedFileTypes.includes(extension)) {
            return false;
        }

        if (file.size > this.maxFileSize) {
            return false;
        }

        return true;
    }

    // Get user documents
    getUserDocuments(userId) {
        return this.documents.filter(d => d.userId === userId);
    }

    // Get document by ID
    getDocument(documentId) {
        return this.documents.find(d => d.id === documentId);
    }

    // Approve document (admin)
    approveDocument(documentId, approvedBy) {
        const document = this.documents.find(d => d.id === documentId);
        if (!document) throw new Error('Document not found');

        document.status = 'approved';
        document.verifiedAt = new Date();
        document.verifiedBy = approvedBy;

        this.saveDocuments();
        return document;
    }

    // Reject document (admin)
    rejectDocument(documentId, reason, rejectedBy) {
        const document = this.documents.find(d => d.id === documentId);
        if (!document) throw new Error('Document not found');

        document.status = 'rejected';
        document.rejectionReason = reason;
        document.rejectedBy = rejectedBy;
        document.rejectedAt = new Date();

        this.saveDocuments();
        return document;
    }

    // Delete document
    deleteDocument(documentId) {
        const index = this.documents.findIndex(d => d.id === documentId);
        if (index > -1) {
            this.documents.splice(index, 1);
            this.saveDocuments();
            return true;
        }
        return false;
    }

    // Check if user is verified (all documents approved)
    isUserVerified(userId) {
        const userDocs = this.getUserDocuments(userId);
        if (userDocs.length === 0) return false;

        return userDocs.every(doc => doc.status === 'approved');
    }

    // Get pending documents
    getPendingDocuments() {
        return this.documents.filter(d => d.status === 'pending');
    }

    // Calculate expiry date based on document type
    calculateExpiryDate(documentType) {
        const now = new Date();
        const expiryDate = new Date(now);

        switch (documentType) {
            case 'license':
                expiryDate.setFullYear(now.getFullYear() + 5); // 5 years
                break;
            case 'insurance':
                expiryDate.setFullYear(now.getFullYear() + 1); // 1 year
                break;
            case 'registration':
                expiryDate.setFullYear(now.getFullYear() + 2); // 2 years
                break;
            default:
                expiryDate.setFullYear(now.getFullYear() + 1); // 1 year
        }

        return expiryDate;
    }

    // Check for expiring documents
    getExpiringDocuments(daysUntilExpiry = 30) {
        const threshold = new Date();
        threshold.setDate(threshold.getDate() + daysUntilExpiry);

        return this.documents.filter(doc =>
            doc.expiryDate <= threshold && doc.expiryDate > new Date()
        );
    }

    // Save documents
    saveDocuments() {
        localStorage.setItem('wayfairDocuments', JSON.stringify(this.documents));
    }

    // Load documents
    loadDocuments() {
        const data = localStorage.getItem('wayfairDocuments');
        return data ? JSON.parse(data) : [];
    }
}

// Initialize document service
const documentService = new DocumentService();
