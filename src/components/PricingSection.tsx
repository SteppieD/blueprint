'use client'

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold gradient-text mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free, upgrade when you need more. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className="glass-card rounded-3xl p-8 relative">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Free</h3>
              <div className="flex items-baseline justify-center mb-4">
                <span className="text-5xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
              <p className="text-gray-600">Perfect for occasional use</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">3 analyses per month</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Basic materials (lumber, plywood)</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">PDF upload up to 4.5MB</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Community support</span>
              </div>
            </div>
            
            <button 
              className="w-full py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-400 transition-colors"
              onClick={() => window.location.reload()}
            >
              Get Started Free
            </button>
          </div>

          {/* Pro Plan */}
          <div className="glass-card rounded-3xl p-8 relative border-2 border-purple-300 shadow-xl">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Pro</h3>
              <div className="flex items-baseline justify-center mb-4">
                <span className="text-5xl font-bold text-gray-900">$29</span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
              <p className="text-gray-600">For professionals & contractors</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">50 analyses per month</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">All material types</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">AI confidence scores</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Export to Excel/CSV</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Priority support</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Price history tracking</span>
              </div>
            </div>
            
            <a
              href="https://buy.stripe.com/pro-plan" // Replace with actual Stripe link
              className="w-full btn-primary text-center block"
            >
              Start 7-Day Free Trial
            </a>
          </div>

          {/* Business Plan */}
          <div className="glass-card rounded-3xl p-8 relative">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Business</h3>
              <div className="flex items-baseline justify-center mb-4">
                <span className="text-5xl font-bold text-gray-900">$99</span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
              <p className="text-gray-600">For teams & growing businesses</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">200 analyses per month</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Everything in Pro</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">API access</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Team accounts (5 users)</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Custom material pricing</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Phone support</span>
              </div>
            </div>
            
            <a
              href="mailto:hello@blueprintanalyzer.com?subject=Business Plan Inquiry"
              className="w-full py-3 px-6 border-2 border-purple-300 text-purple-700 rounded-xl font-medium hover:bg-purple-50 transition-colors text-center block"
            >
              Contact Sales
            </a>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">What happens when I reach my limit?</h4>
              <p className="text-gray-600">Your analyses reset monthly. You can upgrade anytime or purchase additional analyses.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-600">Yes! Cancel anytime with no questions asked. You'll keep access until your billing period ends.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Do you offer refunds?</h4>
              <p className="text-gray-600">We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your purchase.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">What file types do you support?</h4>
              <p className="text-gray-600">Currently we support PDF blueprints up to 4.5MB (50MB on Pro plans). More formats coming soon!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}