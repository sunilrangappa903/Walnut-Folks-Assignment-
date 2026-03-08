document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('tweetForm');
    const generateBtn = document.getElementById('generateBtn');
    
    // UI States
    const emptyState = document.getElementById('emptyState');
    const loadingState = document.getElementById('loadingState');
    const resultsState = document.getElementById('resultsState');
    
    // Result Containers
    const voiceSummaryList = document.getElementById('voiceSummary');
    const tweetsGrid = document.getElementById('tweetsGrid');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // 1. Get form data
        const formData = {
            brandName: document.getElementById('brandName').value,
            industry: document.getElementById('industry').value,
            objective: document.getElementById('objective').value,
            description: document.getElementById('description').value
        };

        // 2. Update UI to Loading State
        emptyState.classList.add('hidden');
        resultsState.classList.add('hidden');
        loadingState.classList.remove('hidden');
        
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="spinner" style="width: 20px; height: 20px; border-width: 2px;"></span> Processing...';

        try {
            // 3. Make API Call
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate tweets');
            }

            const data = await response.json();

            // 4. Update UI with Results
            renderResults(data, formData.brandName || 'Brand');
            
            loadingState.classList.add('hidden');
            resultsState.classList.remove('hidden');

            // Re-initialize feather icons for new elements
            if (window.feather) {
                feather.replace();
            }

        } catch (error) {
            console.error('Error:', error);
            // Revert back or show error state (simplifying to alert for this implementation)
            alert(`Error: ${error.message}\nPlease try again or check your API key.`);
            loadingState.classList.add('hidden');
            emptyState.classList.remove('hidden');
        } finally {
            // Restore button
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<span class="btn-text">Generate Tweets</span><i data-feather="zap"></i>';
            if (window.feather) feather.replace();
        }
    });

    function renderResults(data, brandNameStr) {
        // Clear previous results
        voiceSummaryList.innerHTML = '';
        tweetsGrid.innerHTML = '';

        // Render Voice Summary
        if (data.brand_voice_summary && Array.isArray(data.brand_voice_summary)) {
            data.brand_voice_summary.forEach(point => {
                const li = document.createElement('li');
                li.textContent = point;
                voiceSummaryList.appendChild(li);
            });
        }

        // Render Tweets
        if (data.tweets && Array.isArray(data.tweets)) {
            const initial = brandNameStr.charAt(0).toUpperCase();
            
            data.tweets.forEach(tweet => {
                const styleClass = getStyleClass(tweet.style);
                
                const card = document.createElement('div');
                card.className = 'tweet-card';
                card.innerHTML = `
                    <div class="tweet-header">
                        <div class="tweet-avatar-placeholder">${initial}</div>
                        <span class="tweet-style-tag ${styleClass}">${tweet.style}</span>
                    </div>
                    <div class="tweet-content">${tweet.text}</div>
                    <div class="tweet-actions">
                        <div class="tweet-action" onclick="this.style.color='#f91880'">
                            <i data-feather="heart"></i> Like
                        </div>
                        <div class="tweet-action" onclick="this.style.color='#00ba7c'">
                            <i data-feather="repeat"></i> Retweet
                        </div>
                        <div class="tweet-action" onclick="navigator.clipboard.writeText('${tweet.text.replace(/'/g, "\\'")}'); alert('Copied!');">
                            <i data-feather="copy"></i> Copy
                        </div>
                    </div>
                `;
                tweetsGrid.appendChild(card);
            });
        }
    }

    function getStyleClass(styleString) {
        const style = styleString.toLowerCase();
        if (style.includes('engag')) return 'style-engaging';
        if (style.includes('promo')) return 'style-promotional';
        if (style.includes('wit') || style.includes('meme')) return 'style-witty';
        if (style.includes('inform') || style.includes('value')) return 'style-informative';
        return 'style-default';
    }
});
