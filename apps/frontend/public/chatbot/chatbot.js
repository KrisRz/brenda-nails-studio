/**
 * Brenda Nails Studio Chatbot
 * Professional decision tree chatbot for nail salon
 */
;(() => {
  // Configuration
  const CONFIG = {
    typingDelay: 800,
    messageDelay: 300,
    soundEnabled: true,
    animationDuration: 300,
    // PHASE 2 - API Configuration
    apiBaseUrl: 'https://api.brendanails.com', // Will be replaced with actual API Gateway URL
  }

  // Dynamic greeting generator
  function getDynamicGreeting() {
    const hour = new Date().getHours()
    const isReturningVisitor = localStorage.getItem('bn_chatbot_visited')

    let timeGreeting
    if (hour < 12) {
      timeGreeting = 'Good morning! ☀️'
    } else if (hour < 17) {
      timeGreeting = 'Good afternoon! 🌤️'
    } else {
      timeGreeting = 'Good evening! 🌙'
    }

    let personalGreeting
    if (isReturningVisitor) {
      personalGreeting = 'Welcome back! 💅'
    } else {
      personalGreeting = "Hi! 👋 I'm Brenda's assistant."
      localStorage.setItem('bn_chatbot_visited', 'true')
    }

    return `${timeGreeting} ${personalGreeting} How can I help you today?`
  }

  // Initialize chatbot
  function initChatbot() {
    const mount = document.getElementById('bn-chatbot')
    if (!mount) {
      console.warn('Brenda Nails Chatbot: Mount element #bn-chatbot not found')
      return
    }

    // Create main container
    const root = document.createElement('div')
    root.id = 'bn-chatbot-root'
    root.setAttribute('role', 'complementary')
    root.setAttribute('aria-label', 'Brenda Nails Studio Chat Assistant')

    // Create chat panel
    const panel = document.createElement('div')
    panel.className = 'bn-panel'
    panel.setAttribute('role', 'dialog')
    panel.setAttribute('aria-labelledby', 'bn-header-title')
    panel.setAttribute('aria-live', 'polite')

    // Create header
    const header = document.createElement('div')
    header.className = 'bn-header'
    header.innerHTML = `
      <span id="bn-header-title">💅 Brenda's Assistant</span>
      <button class="bn-btn" id="bn-close" aria-label="Close chat" title="Close chat">×</button>
    `

    // Create body
    const body = document.createElement('div')
    body.className = 'bn-body'
    body.setAttribute('role', 'log')
    body.setAttribute('aria-live', 'polite')
    body.setAttribute('aria-atomic', 'false')

    // Assemble panel
    panel.appendChild(header)
    panel.appendChild(body)

    // Create chat bubble
    const bubble = document.createElement('button')
    bubble.className = 'bn-bubble'
    bubble.setAttribute('aria-label', 'Open Brenda Nails chat assistant')
    bubble.setAttribute('title', "Chat with Brenda's Assistant")
    bubble.innerHTML = '💬'

    // Assemble root
    root.appendChild(panel)
    root.appendChild(bubble)
    mount.appendChild(root)

    // Initialize chatbot logic
    const chatbot = new BrendaChatbot(body, panel, bubble)

    // Event listeners
    bubble.addEventListener('click', () => chatbot.open())
    header
      .querySelector('#bn-close')
      .addEventListener('click', () => chatbot.close())

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.style.display === 'flex') {
        chatbot.close()
      }
    })

    // Initialize with welcome message
    chatbot.loadDecisionTree()
  }

  /**
   * Main Chatbot Class
   */
  class BrendaChatbot {
    constructor(bodyElement, panelElement, bubbleElement) {
      this.body = bodyElement
      this.panel = panelElement
      this.bubble = bubbleElement
      this.tree = null
      this.currentNode = null
      this.messageHistory = []
      this.isOpen = false
    }

    /**
     * Load decision tree from JSON
     */
    async loadDecisionTree() {
      try {
        const response = await fetch('/chatbot/decision_tree.json')
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        this.tree = await response.json()
        this.renderNode(this.tree.start || 'welcome')

        // Add welcome animation
        this.addWelcomeAnimation()
      } catch (error) {
        console.error(
          'Brenda Nails Chatbot: Failed to load decision tree:',
          error
        )
        this.showError(
          "Sorry, I'm having trouble connecting. Please try refreshing the page or contact us directly."
        )
      }
    }

    /**
     * Add subtle welcome animation to bubble
     */
    addWelcomeAnimation() {
      setTimeout(() => {
        this.bubble.style.animation = 'pulse 2s infinite'

        // Add CSS for pulse animation if not exists
        if (!document.querySelector('#bn-pulse-animation')) {
          const style = document.createElement('style')
          style.id = 'bn-pulse-animation'
          style.textContent = `
            @keyframes pulse {
              0% { box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25); }
              50% { box-shadow: 0 15px 40px rgba(255, 128, 181, 0.4); }
              100% { box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25); }
            }
          `
          document.head.appendChild(style)
        }
      }, 2000)
    }

    /**
     * Render a decision tree node
     */
    renderNode(nodeKey) {
      if (!this.tree || !this.tree.nodes || !this.tree.nodes[nodeKey]) {
        this.showError(
          `Sorry, I couldn't find that information. Let me start over.`
        )
        this.renderNode(this.tree?.start || 'welcome')
        return
      }

      this.currentNode = nodeKey
      const node = this.tree.nodes[nodeKey]

      // Clear body and show typing indicator
      this.body.innerHTML = ''
      this.showTypingIndicator()

      // Add message after delay for natural feel
      setTimeout(() => {
        this.hideTypingIndicator()
        this.addMessage(node.msg, node.image)

        // Add choices after message appears
        setTimeout(() => {
          this.addChoices(node.choices || [])
        }, CONFIG.messageDelay)
      }, CONFIG.typingDelay)
    }

    /**
     * Add message to chat
     */
    addMessage(message, imageUrl = null) {
      const msgElement = document.createElement('div')
      msgElement.className = 'bn-msg'

      // Handle dynamic greetings
      if (message === 'DYNAMIC_GREETING') {
        message = getDynamicGreeting()
      }

      msgElement.textContent = message
      msgElement.setAttribute('role', 'status')

      // Add image if provided
      if (imageUrl) {
        const imageElement = document.createElement('img')
        imageElement.src = imageUrl
        imageElement.alt = 'Service example'
        imageElement.className = 'bn-service-image'
        imageElement.style.cssText = `
          width: 100%;
          max-width: 200px;
          height: auto;
          border-radius: 12px;
          margin: 8px 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `
        msgElement.appendChild(document.createElement('br'))
        msgElement.appendChild(imageElement)
      }

      // Add with fade-in animation
      msgElement.style.opacity = '0'
      msgElement.style.transform = 'translateY(10px)'

      this.body.appendChild(msgElement)
      this.scrollToBottom()

      // Animate in
      requestAnimationFrame(() => {
        msgElement.style.transition = 'all 0.3s ease'
        msgElement.style.opacity = '1'
        msgElement.style.transform = 'translateY(0)'
      })

      // Store in history
      this.messageHistory.push({
        type: 'message',
        content: message,
        timestamp: Date.now(),
      })
    }

    /**
     * Add choice buttons
     */
    addChoices(choices) {
      if (!choices.length) return

      const choicesContainer = document.createElement('div')
      choicesContainer.className = 'bn-choices'
      choicesContainer.setAttribute('role', 'group')
      choicesContainer.setAttribute('aria-label', 'Response options')

      choices.forEach((choice, index) => {
        const chip = document.createElement('button')
        chip.className = 'bn-chip'
        chip.textContent = choice.label
        chip.setAttribute('role', 'button')
        chip.setAttribute('tabindex', '0')
        chip.setAttribute('aria-describedby', 'bn-choice-help')

        // Add click handler
        chip.addEventListener('click', () => this.handleChoice(choice))

        // Add keyboard support
        chip.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            this.handleChoice(choice)
          }
        })

        // Animate in with stagger
        chip.style.opacity = '0'
        chip.style.transform = 'translateY(10px)'

        choicesContainer.appendChild(chip)

        // Staggered animation
        setTimeout(() => {
          chip.style.transition = 'all 0.3s ease'
          chip.style.opacity = '1'
          chip.style.transform = 'translateY(0)'
        }, index * 100)
      })

      this.body.appendChild(choicesContainer)
      this.scrollToBottom()
    }

    /**
     * Handle choice selection
     */
    handleChoice(choice) {
      // Play sound if available
      this.playSound('click')

      // Store choice in history
      this.messageHistory.push({
        type: 'choice',
        content: choice.label,
        timestamp: Date.now(),
      })

      // Handle different choice types
      if (choice.action) {
        // PHASE 2 - Handle API actions
        this.handleApiAction(choice)
      } else if (choice.url) {
        // External link or anchor
        if (choice.url.startsWith('#')) {
          // Internal anchor - close chat and scroll
          this.close()
          setTimeout(() => {
            const target = document.querySelector(choice.url)
            if (target) {
              target.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              })
            }
          }, 300)
        } else {
          // External link
          window.open(choice.url, '_blank', 'noopener,noreferrer')
        }
      } else if (choice.next) {
        // Navigate to next node
        this.renderNode(choice.next)
      }
    }

    /**
     * PHASE 2 - Handle API actions
     */
    async handleApiAction(choice) {
      const { action } = choice

      switch (action) {
        case 'check_availability':
          await this.handleAvailabilityCheck(choice)
          break
        case 'select_service':
          await this.handleServiceSelection(choice)
          break
        case 'input_email':
          await this.handleEmailInput()
          break
        case 'date_picker':
          await this.handleDatePicker()
          break
        default:
          this.addMessage(
            'Sorry, that action is not implemented yet. Please call us at 075111201840.'
          )
      }
    }

    /**
     * Handle availability checking
     */
    async handleAvailabilityCheck(choice) {
      this.addMessage('Checking availability... 🔍')

      try {
        const { period } = choice
        let dates = []

        if (period === 'this_week') {
          dates = this.getThisWeekDates()
        } else if (period === 'next_week') {
          dates = this.getNextWeekDates()
        }

        // Check availability for each date
        const availability = []
        for (const date of dates) {
          const result = await this.checkAvailabilityApi(date)
          availability.push({ date, ...result })
        }

        this.showAvailabilityResults(availability)
      } catch (error) {
        console.error('Availability check failed:', error)
        this.addMessage(
          "Sorry, I couldn't check availability right now. Please call 075111201840 for assistance."
        )
      }
    }

    /**
     * Handle service selection for booking
     */
    async handleServiceSelection(choice) {
      const { service } = choice

      // Store selected service
      this.selectedService = service

      this.addMessage(
        `Great choice! You've selected ${this.getServiceName(service)}. 🎯\n\nNow let's find you the perfect time slot.`
      )

      // Show date options
      setTimeout(() => {
        this.addChoices([
          {
            label: '📅 This week',
            action: 'check_service_availability',
            period: 'this_week',
          },
          {
            label: '📅 Next week',
            action: 'check_service_availability',
            period: 'next_week',
          },
          { label: '📅 Pick specific date', action: 'date_picker' },
          { label: '⬅️ Choose different service', next: 'new_customer_flow' },
        ])
      }, 1000)
    }

    /**
     * Handle email input for returning customers
     */
    async handleEmailInput() {
      const email = prompt('Please enter your email address:')

      if (!email || !this.isValidEmail(email)) {
        this.addMessage('Please enter a valid email address.')
        return
      }

      this.addMessage('Looking up your information... 🔍')

      try {
        const customer = await this.getCustomerApi(email)

        if (customer) {
          this.addMessage(
            `Welcome back, ${customer.firstName}! 💅\n\nI found your previous appointments. What would you like to book today?`
          )
          this.currentCustomer = customer
          // Show service selection for returning customer
          setTimeout(() => {
            this.addChoices([
              { label: '🔄 Same as last time', action: 'book_same_service' },
              { label: '🆕 Different service', next: 'new_customer_flow' },
              { label: "📞 I'd rather call", url: 'tel:075111201840' },
            ])
          }, 1000)
        } else {
          this.addMessage(
            "I couldn't find your email in our system. Let's book you as a new customer! 🆕"
          )
          setTimeout(() => {
            this.renderNode('new_customer_flow')
          }, 1500)
        }
      } catch (error) {
        console.error('Customer lookup failed:', error)
        this.addMessage(
          "Sorry, I couldn't look up your information. Please call 075111201840 for assistance."
        )
      }
    }

    /**
     * API Methods
     */
    async checkAvailabilityApi(date, service = null) {
      const params = new URLSearchParams({ date })
      if (service) params.append('service', service)

      const response = await fetch(
        `${CONFIG.apiBaseUrl}/availability?${params}`
      )
      if (!response.ok) throw new Error('API request failed')

      return await response.json()
    }

    async getCustomerApi(email) {
      const response = await fetch(`${CONFIG.apiBaseUrl}/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_customer',
          data: { email },
        }),
      })

      if (!response.ok) throw new Error('API request failed')

      const result = await response.json()
      return result.customer
    }

    /**
     * Utility methods
     */
    getThisWeekDates() {
      const dates = []
      const today = new Date()

      for (let i = 0; i < 7; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        dates.push(date.toISOString().split('T')[0])
      }

      return dates
    }

    getNextWeekDates() {
      const dates = []
      const today = new Date()

      for (let i = 7; i < 14; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        dates.push(date.toISOString().split('T')[0])
      }

      return dates
    }

    showAvailabilityResults(availability) {
      const availableDates = availability.filter((day) => day.available)

      if (availableDates.length === 0) {
        this.addMessage(
          'Sorry, no availability found for those dates. Please call 075111201840 to arrange an appointment.'
        )
        return
      }

      let message = "Here's your availability: 📅\n\n"
      availableDates.forEach((day) => {
        const date = new Date(day.date).toLocaleDateString('en-GB', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
        message += `${date}: ${day.availableSlots?.length || 0} slots available\n`
      })

      this.addMessage(message)

      // Show booking options
      setTimeout(() => {
        this.addChoices([
          { label: '📅 Book one of these dates', next: 'real_booking_start' },
          { label: '📞 Call to discuss times', url: 'tel:075111201840' },
          { label: '⬅️ Back to booking', next: 'booking_flow' },
        ])
      }, 1000)
    }

    getServiceName(serviceKey) {
      const serviceNames = {
        gel_manicure: 'Gel Manicure (£30)',
        gel_acrylic: 'Gel Acrylic Nails (£45)',
        french_manicure: 'French Manicure (£30)',
        gel_infill_early: 'Gel Infill ≤3 weeks (£30)',
        gel_infill_late: 'Gel Infill >3 weeks (£35)',
        cartoon_art: 'Cartoon Art per nail (£5)',
      }
      return serviceNames[serviceKey] || serviceKey
    }

    isValidEmail(email) {
      return /\S+@\S+\.\S+/.test(email)
    }

    /**
     * Show typing indicator
     */
    showTypingIndicator() {
      const typing = document.createElement('div')
      typing.className = 'bn-typing'
      typing.id = 'bn-typing-indicator'
      typing.textContent = 'Brenda is typing...'
      typing.setAttribute('aria-label', 'Assistant is typing')

      this.body.appendChild(typing)
      this.scrollToBottom()
    }

    /**
     * Hide typing indicator
     */
    hideTypingIndicator() {
      const typing = this.body.querySelector('#bn-typing-indicator')
      if (typing) {
        typing.remove()
      }
    }

    /**
     * Show error message
     */
    showError(message) {
      this.body.innerHTML = ''

      const errorMsg = document.createElement('div')
      errorMsg.className = 'bn-msg'
      errorMsg.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)'
      errorMsg.style.color = '#fff'
      errorMsg.textContent = message
      errorMsg.setAttribute('role', 'alert')

      this.body.appendChild(errorMsg)
      this.scrollToBottom()

      // Add retry options
      setTimeout(() => {
        const retryChoices = [
          { label: '🔄 Try again', next: 'welcome' },
          { label: '📞 Call us instead', url: 'tel:075111201840' },
          {
            label: '✉️ Send email',
            url: 'mailto:beniahaker@interia.eu?subject=Website%20Chat%20Issue',
          },
        ]
        this.addChoices(retryChoices)
      }, 1000)
    }

    /**
     * Open chat panel
     */
    open() {
      this.panel.style.display = 'flex'
      this.bubble.style.display = 'none'
      this.isOpen = true

      // Focus management for accessibility
      const firstChoice = this.body.querySelector('.bn-chip')
      if (firstChoice) {
        firstChoice.focus()
      }

      this.playSound('open')
      this.scrollToBottom()

      // Analytics tracking (if available)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'chatbot_open', {
          event_category: 'engagement',
          event_label: 'brenda_nails_chatbot',
        })
      }
    }

    /**
     * Close chat panel
     */
    close() {
      this.panel.style.display = 'none'
      this.bubble.style.display = 'flex'
      this.isOpen = false

      this.playSound('close')

      // Return focus to bubble
      this.bubble.focus()

      // Analytics tracking (if available)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'chatbot_close', {
          event_category: 'engagement',
          event_label: 'brenda_nails_chatbot',
          value: this.messageHistory.length,
        })
      }
    }

    /**
     * Scroll to bottom of chat
     */
    scrollToBottom() {
      requestAnimationFrame(() => {
        this.body.scrollTop = this.body.scrollHeight
      })
    }

    /**
     * Play sound effect (if available)
     */
    playSound(type) {
      if (!CONFIG.soundEnabled) return

      // Check if soundSystem is available from the main site
      if (
        typeof window.soundSystem !== 'undefined' &&
        window.soundSystem.play
      ) {
        const soundMap = {
          click: 'button-click',
          open: 'modal-open',
          close: 'modal-close',
        }

        const soundName = soundMap[type]
        if (soundName) {
          window.soundSystem.play(soundName)
        }
      }
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot)
  } else {
    initChatbot()
  }

  // Expose for debugging
  if (typeof window !== 'undefined') {
    window.BrendaChatbot = BrendaChatbot
  }
})()
