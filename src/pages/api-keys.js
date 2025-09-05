// =============================================================================
// 📝 API KEYS PAGE - Simple and Working
// =============================================================================

import { getNavigation, getSharedScript } from '../shared/navigation.js';

export function getApiKeysPage(UNIFIED_CSS) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Keys - OAuth Hub</title>
    <style>
        ${UNIFIED_CSS}
        
        .alert {
            padding: var(--space-3);
            border-radius: var(--radius-md);
            border: 1px solid;
        }
        
        .alert-success {
            background: #f0f9ff;
            border-color: #0ea5e9;
            color: #0369a1;
        }
    </style>
</head>
<body>
    <div class="app-layout">
        ${getNavigation('api-keys')}
        
        <main class="main">
            <div class="container">
                <div class="page-header">
                    <h1 class="page-title">API Keys</h1>
                    <p class="page-description">
                        Generate and manage API keys for accessing OAuth Hub services
                    </p>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Generate New API Key</h2>
                        <button onclick="showAddKeyModal()" class="btn btn-primary">
                            <span>🔑</span>
                            Generate API Key
                        </button>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Your API Keys</h2>
                    </div>
                    
                    <div id="keysList">
                        <div class="text-center" style="padding: var(--space-8);">
                            <div style="font-size: 3rem; margin-bottom: var(--space-4); opacity: 0.3;">🔑</div>
                            <h3 style="color: var(--gray-500);">No API Keys Yet</h3>
                            <p style="color: var(--gray-400);">Generate your first API key to get started</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    
    <!-- Add API Key Modal -->
    <div id="addKeyModal" class="modal-overlay">
        <div class="modal">
            <div class="modal-header">
                <h2 class="modal-title">Generate New API Key</h2>
                <button onclick="hideAddKeyModal()" class="modal-close">&times;</button>
            </div>
            
            <form id="key-form">
                <div class="form-group">
                    <label class="form-label">API Key Name</label>
                    <input type="text" id="keyName" class="form-input" placeholder="e.g., My Application, Production Server" required>
                    <div style="font-size: 0.875rem; color: var(--gray-600); margin-top: var(--space-1);">
                        Give your API key a descriptive name to help identify it later
                    </div>
                </div>
                
                <div class="flex gap-4" style="margin-top: var(--space-6);">
                    <button type="submit" class="btn btn-primary">
                        <span>🔑</span>
                        Generate API Key
                    </button>
                    <button type="button" onclick="hideAddKeyModal()" class="btn btn-secondary">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Success Modal -->
    <div id="successModal" class="modal-overlay">
        <div class="modal">
            <div class="modal-header">
                <h2 class="modal-title">API Key Generated Successfully!</h2>
                <button onclick="hideSuccessModal()" class="modal-close">&times;</button>
            </div>
            
            <div style="padding: var(--space-4) 0;">
                <div class="alert alert-success" style="margin-bottom: var(--space-4);">
                    <strong>⚠️ Important:</strong> Copy this key now - it won't be shown again for security reasons!
                </div>
                
                <div class="form-group">
                    <label class="form-label">API Key Name</label>
                    <div id="generatedKeyName" style="padding: var(--space-2); background: var(--gray-50); border-radius: var(--radius-md); font-weight: 500;"></div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">API Key</label>
                    <div style="display: flex; gap: var(--space-2);">
                        <input type="text" id="generatedKey" class="form-input" readonly style="flex: 1; background: var(--gray-50); font-family: var(--font-mono);">
                        <button type="button" onclick="copyGeneratedKey()" class="btn btn-secondary">Copy</button>
                    </div>
                </div>
            </div>
            
            <div class="flex justify-end" style="margin-top: var(--space-6);">
                <button onclick="hideSuccessModal()" class="btn btn-primary">
                    Done
                </button>
            </div>
        </div>
    </div>
    
    ${getSharedScript()}
    <script>
        // Store keys in memory for this session
        let apiKeys = [];
        
        // Load existing API keys from server
        async function loadApiKeys() {
            try {
                console.log('Loading API keys for email:', localStorage.getItem('userEmail'));
                const response = await fetch(\`/user-keys?email=\${encodeURIComponent(localStorage.getItem('userEmail'))}\`);
                console.log('Response status:', response.status);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('Received API keys data:', data);
                    apiKeys = data.keys || [];
                    console.log('Updated apiKeys array:', apiKeys);
                    updateKeysList();
                } else {
                    console.error('Failed to load API keys', response.status);
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                }
            } catch (error) {
                console.error('Error loading API keys:', error);
            }
        }
        
        // Load keys when page loads
        loadApiKeys();
        
        // Modal functions
        function showAddKeyModal() {
            document.getElementById('addKeyModal').classList.add('show');
            document.body.style.overflow = 'hidden';
        }
        
        function hideAddKeyModal() {
            document.getElementById('addKeyModal').classList.remove('show');
            document.body.style.overflow = '';
            document.getElementById('key-form').reset();
        }
        
        function showSuccessModal(keyName, apiKey) {
            document.getElementById('generatedKeyName').textContent = keyName;
            document.getElementById('generatedKey').value = apiKey;
            document.getElementById('successModal').classList.add('show');
            document.body.style.overflow = 'hidden';
        }
        
        function hideSuccessModal() {
            document.getElementById('successModal').classList.remove('show');
            document.body.style.overflow = '';
        }
        
        function copyGeneratedKey() {
            const keyField = document.getElementById('generatedKey');
            keyField.select();
            document.execCommand('copy');
            
            // Also try modern clipboard API
            navigator.clipboard.writeText(keyField.value).catch(() => {});
            
            // Visual feedback
            const btn = event.target;
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            btn.style.background = 'var(--success-500)';
            btn.style.color = 'white';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.color = '';
            }, 2000);
        }
        
        
        // Make functions globally accessible
        window.showAddKeyModal = showAddKeyModal;
        window.hideAddKeyModal = hideAddKeyModal;
        window.hideSuccessModal = hideSuccessModal;
        window.copyGeneratedKey = copyGeneratedKey;
        
        // Form submission
        document.getElementById('key-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const keyName = document.getElementById('keyName').value.trim();
            if (!keyName) return;
            
            try {
                // Call backend API to generate key
                const response = await fetch('/generate-key', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: localStorage.getItem('userEmail'),
                        name: keyName
                    })
                });
                
                if (response.ok) {
                    const result = await response.json();
                    
                    // Reload keys from server to get the latest data
                    await loadApiKeys();
                    
                    // Hide the form modal and show success modal
                    hideAddKeyModal();
                    showSuccessModal(keyName, result.key.key);
                } else {
                    const error = await response.json();
                    alert('Error generating API key: ' + (error.error || 'Unknown error'));
                }
            } catch (error) {
                alert('Network error. Please try again.');
            }
        });
        
        // Update keys list display
        function updateKeysList() {
            const container = document.getElementById('keysList');
            
            if (apiKeys.length === 0) {
                container.innerHTML = \`
                    <div class="text-center" style="padding: var(--space-8);">
                        <div style="font-size: 3rem; margin-bottom: var(--space-4); opacity: 0.3;">🔑</div>
                        <h3 style="color: var(--gray-500);">No API Keys Yet</h3>
                        <p style="color: var(--gray-400);">Generate your first API key to get started</p>
                    </div>
                \`;
                return;
            }
            
            container.innerHTML = apiKeys.map((key, index) => \`
                <div style="padding: var(--space-4); border: 1px solid var(--border-color); border-radius: var(--radius-md); margin-bottom: var(--space-3);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h4 style="margin: 0 0 var(--space-2) 0; color: var(--gray-800);">\${key.name}</h4>
                            <code style="font-family: var(--font-mono); color: var(--gray-500); font-size: 0.9em;">
                                \${key.key.substring(0, 10)}...
                            </code>
                            <div style="font-size: 0.85em; color: var(--gray-400); margin-top: var(--space-2);">
                                Created: \${new Date(key.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                        <div style="display: flex; gap: var(--space-2);">
                            <button onclick="copyKey('\${key.key}')" class="btn btn-secondary">
                                Copy
                            </button>
                            <button onclick="deleteKey(\${index})" class="btn btn-secondary" style="color: var(--danger-500);">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            \`).join('');
        }
        
        // Copy key to clipboard
        window.copyKey = function(key) {
            navigator.clipboard.writeText(key).then(() => {
                alert('API key copied to clipboard!');
            }).catch(() => {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = key;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                alert('API key copied to clipboard!');
            });
        }
        
        // Delete key
        window.deleteKey = async function(index) {
            if (confirm('Are you sure you want to delete this API key?')) {
                const keyToDelete = apiKeys[index];
                
                try {
                    // Call backend to delete the key
                    const response = await fetch('/delete-key/' + keyToDelete.id + '?email=' + encodeURIComponent(localStorage.getItem('userEmail')), {
                        method: 'DELETE'
                    });
                    
                    if (response.ok) {
                        // Remove from local array and update UI
                        apiKeys.splice(index, 1);
                        updateKeysList();
                    } else {
                        const error = await response.json();
                        alert('Error deleting API key: ' + (error.error || 'Unknown error'));
                    }
                } catch (error) {
                    alert('Network error. Please try again.');
                }
            }
        }
    </script>
</body>
</html>`;
}