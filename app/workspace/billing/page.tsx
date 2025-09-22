'use client';

import React from 'react'
import { PricingTable } from '@clerk/nextjs'

const BillingPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Select Plan
                    </h1>
                </div>
                <div className="pricing-table-wrapper">
                    <PricingTable 
                        appearance={{
                            elements: {
                                pricingTable: "responsive-pricing-table",
                                card: "pricing-card"
                            }
                        }}
                    />
                </div>
            </div>
            
            <style jsx global>{`
                .pricing-table-wrapper {
                    display: flex;
                    justify-content: center;
                    width: 100%;
                }
                
                /* Responsive layout for larger screens */
                @media (min-width: 768px) {
                    .pricing-table-wrapper [data-clerk-element="pricingTable"] {
                        display: grid !important;
                        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
                        gap: 2rem !important;
                        max-width: 1200px !important;
                        margin: 0 auto !important;
                    }
                    
                    .pricing-table-wrapper [data-clerk-element="card"] {
                        width: 100% !important;
                        max-width: none !important;
                    }
                }
                
                /* Vertical layout for smaller screens */
                @media (max-width: 767px) {
                    .pricing-table-wrapper [data-clerk-element="pricingTable"] {
                        display: flex !important;
                        flex-direction: column !important;
                        align-items: center !important;
                        gap: 1.5rem !important;
                    }
                    
                    .pricing-table-wrapper [data-clerk-element="card"] {
                        width: 100% !important;
                        max-width: 400px !important;
                    }
                }
                
                /* Ensure cards are properly centered */
                .pricing-table-wrapper {
                    justify-content: center;
                    align-items: center;
                }
            `}</style>
        </div>
    )
}

export default BillingPage
