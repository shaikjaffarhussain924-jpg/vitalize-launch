export const CLINIC = {
  name: "HealthFirst Clinic",
  tagline: "Advanced Care, Compassionate Healing",
  city: "Hyderabad",
  phone: "+91-98765-43210",
  phoneRaw: "919876543210",
  email: "info@healthfirstclinic.com",
  address: "123, Jubilee Hills, Hyderabad - 500033",
  whatsapp: "919876543210",
  hours: "Mon - Sat: 9:00 AM - 8:00 PM",
  hoursSchema: "Mo-Sa 09:00-20:00",
  url: "https://healthfirstclinic.com",
  rating: "4.9",
  reviewCount: "500",
  patientCount: "15,000",
  yearsFounded: 2009,
  doctorCount: "25",
  web3formsKey: "YOUR_KEY_HERE",
  pixelId: "YOUR_PIXEL_ID",
  gtmId: "GTM-XXXXXXX",
  ga4Id: "G-XXXXXXXXXX",
} as const;

export const WHATSAPP_LINKS = {
  general: `https://wa.me/${CLINIC.whatsapp}?text=Hi%2C%20I%20want%20to%20know%20more%20about%20your%20services`,
  booking: `https://wa.me/${CLINIC.whatsapp}?text=Hi%2C%20I%20just%20booked%20an%20appointment.%20Please%20confirm.`,
  floating: `https://wa.me/${CLINIC.whatsapp}?text=Hi%2C%20I%20found%20you%20on%20Google%20and%20want%20to%20book%20an%20appointment`,
  service: (name: string) => `https://wa.me/${CLINIC.whatsapp}?text=Hi%2C%20I%20am%20interested%20in%20${encodeURIComponent(name)}%20treatment`,
} as const;

export const SERVICES = [
  { slug: "general-medicine", name: "General Medicine", icon: "Stethoscope", description: "Comprehensive primary healthcare for all ages", price: "₹500" },
  { slug: "cardiology", name: "Cardiology", icon: "Heart", description: "Advanced heart care and cardiac diagnostics", price: "₹1,500" },
  { slug: "dermatology", name: "Dermatology", icon: "Sparkles", description: "Expert skin, hair, and cosmetic treatments", price: "₹800" },
  { slug: "orthopedics", name: "Orthopedics", icon: "Bone", description: "Joint, bone, and musculoskeletal care", price: "₹1,200" },
  { slug: "gynecology", name: "Gynecology", icon: "Baby", description: "Complete women's health and maternity care", price: "₹1,000" },
  { slug: "pediatrics", name: "Pediatrics", icon: "HeartHandshake", description: "Specialized healthcare for infants and children", price: "₹600" },
] as const;

export const DOCTORS = [
  { id: 1, name: "Dr. Rajesh Kumar", designation: "Senior Consultant", specialization: "Cardiology", qualification: "MBBS, MD (Cardiology), FACC", experience: 18, languages: "English, Hindi, Telugu", regNo: "TSM-12345" },
  { id: 2, name: "Dr. Priya Sharma", designation: "Chief Dermatologist", specialization: "Dermatology", qualification: "MBBS, MD (Dermatology), DDV", experience: 14, languages: "English, Hindi", regNo: "TSM-23456" },
  { id: 3, name: "Dr. Anil Reddy", designation: "Head of Orthopedics", specialization: "Orthopedics", qualification: "MBBS, MS (Ortho), MCh", experience: 20, languages: "English, Hindi, Telugu", regNo: "TSM-34567" },
  { id: 4, name: "Dr. Sunita Patel", designation: "Senior Gynecologist", specialization: "Gynecology", qualification: "MBBS, MD (OB-GYN), DGO", experience: 16, languages: "English, Hindi, Gujarati", regNo: "TSM-45678" },
  { id: 5, name: "Dr. Vikram Singh", designation: "General Physician", specialization: "General Medicine", qualification: "MBBS, MD (General Medicine)", experience: 12, languages: "English, Hindi", regNo: "TSM-56789" },
  { id: 6, name: "Dr. Meera Nair", designation: "Pediatric Specialist", specialization: "Pediatrics", qualification: "MBBS, MD (Pediatrics), IAP Fellow", experience: 10, languages: "English, Hindi, Malayalam", regNo: "TSM-67890" },
] as const;

export const TESTIMONIALS = [
  { name: "Ramesh Gupta", city: "Hyderabad", rating: 5, text: "The best medical care I've ever received. Dr. Kumar's expertise in cardiology is unmatched. The entire staff was incredibly caring and professional.", treatment: "Cardiology" },
  { name: "Ananya Devi", city: "Secunderabad", rating: 5, text: "Dr. Priya transformed my skin completely. After years of struggling with acne, I finally found the right treatment here. Highly recommended!", treatment: "Dermatology" },
  { name: "Suresh Babu", city: "Hyderabad", rating: 5, text: "My knee replacement surgery was a complete success. Dr. Anil and his team made the entire process smooth and painless. Walking comfortably again!", treatment: "Orthopedics" },
  { name: "Lakshmi Rao", city: "Warangal", rating: 5, text: "The prenatal care at HealthFirst was exceptional. Dr. Sunita guided me through every step of my pregnancy with patience and expertise.", treatment: "Gynecology" },
  { name: "Mohammad Irfan", city: "Hyderabad", rating: 5, text: "Quick diagnosis, affordable treatment, and genuine care. Dr. Vikram is a gem. The clinic is clean, modern, and well-equipped.", treatment: "General Medicine" },
  { name: "Kavitha Reddy", city: "Vijayawada", rating: 4, text: "My daughter's pediatric care here has been outstanding. Dr. Meera is so patient with children and explains everything clearly to parents.", treatment: "Pediatrics" },
] as const;

export const BLOG_POSTS = [
  { slug: "10-warning-signs-heart-disease", title: "10 Warning Signs of Heart Disease You Shouldn't Ignore", excerpt: "Learn about the early warning signs of heart disease and when to seek immediate medical attention.", category: "Cardiology", author: "Dr. Rajesh Kumar", date: "2024-12-15", readTime: "5 min" },
  { slug: "winter-skin-care-tips", title: "Winter Skin Care Tips for Indian Climate", excerpt: "Essential dermatologist-approved tips to keep your skin healthy and glowing during winter months.", category: "Dermatology", author: "Dr. Priya Sharma", date: "2024-12-10", readTime: "4 min" },
  { slug: "managing-joint-pain-naturally", title: "Managing Joint Pain Naturally: An Orthopedic Guide", excerpt: "Discover natural methods and exercises recommended by orthopedic specialists for joint pain relief.", category: "Orthopedics", author: "Dr. Anil Reddy", date: "2024-12-05", readTime: "6 min" },
  { slug: "importance-regular-health-checkups", title: "Why Regular Health Checkups Are Essential After 30", excerpt: "A comprehensive guide on preventive health screenings every adult should get regularly.", category: "General Medicine", author: "Dr. Vikram Singh", date: "2024-11-28", readTime: "4 min" },
  { slug: "childhood-vaccination-guide", title: "Complete Childhood Vaccination Guide for Indian Parents", excerpt: "Everything parents need to know about the recommended vaccination schedule for children in India.", category: "Pediatrics", author: "Dr. Meera Nair", date: "2024-11-20", readTime: "7 min" },
  { slug: "pregnancy-nutrition-guide", title: "Pregnancy Nutrition: What to Eat in Each Trimester", excerpt: "A trimester-by-trimester guide to optimal nutrition for expecting mothers in India.", category: "Gynecology", author: "Dr. Sunita Patel", date: "2024-11-15", readTime: "5 min" },
] as const;

export const FAQ_DATA = {
  General: [
    { q: "What are the clinic's working hours?", a: "We are open Monday to Saturday, 9:00 AM to 8:00 PM. Sunday consultations are available by appointment only." },
    { q: "Do I need to book an appointment in advance?", a: "While walk-ins are welcome, we recommend booking an appointment to minimize wait time and ensure your preferred doctor is available." },
    { q: "Is parking available at the clinic?", a: "Yes, we have free parking for patients. Valet parking is also available during peak hours." },
    { q: "What safety measures do you follow?", a: "We follow strict hygiene protocols including regular sanitization, temperature screening, and mandatory masking in clinical areas." },
    { q: "Can I get my medical records online?", a: "Yes, all patients can access their medical records through our patient portal or request them via WhatsApp." },
  ],
  Appointments: [
    { q: "How do I book an appointment?", a: "You can book online through our website, call us at +91-98765-43210, or message us on WhatsApp for instant booking." },
    { q: "Can I reschedule my appointment?", a: "Yes, you can reschedule up to 2 hours before your appointment time through WhatsApp or by calling our reception." },
    { q: "What is the consultation fee?", a: "Consultation fees start from ₹500 for general medicine. Specialist consultations range from ₹800 to ₹1,500." },
    { q: "Do you offer teleconsultation?", a: "Yes, video consultations are available for follow-up visits and non-emergency cases. Book through our website or WhatsApp." },
    { q: "What should I bring to my first appointment?", a: "Please bring your ID proof, any previous medical reports, current medications list, and insurance card if applicable." },
  ],
  Insurance: [
    { q: "Which insurance providers do you accept?", a: "We accept all major insurance providers including Star Health, ICICI Lombard, Max Bupa, HDFC Ergo, and government schemes like Ayushman Bharat." },
    { q: "Is cashless treatment available?", a: "Yes, cashless treatment is available for most insurance plans. Our team will help you with pre-authorization." },
    { q: "How do I file an insurance claim?", a: "Our dedicated insurance desk handles all claim paperwork. Just bring your insurance card and we'll take care of the rest." },
    { q: "Are EMI options available for treatments?", a: "Yes, we offer EMI options through major banks and payment providers for treatments above ₹10,000." },
    { q: "Do you accept government health schemes?", a: "Yes, we accept Ayushman Bharat, Aarogyasri, and other state government health schemes." },
  ],
  Treatments: [
    { q: "What specialties are available at the clinic?", a: "We offer General Medicine, Cardiology, Dermatology, Orthopedics, Gynecology, Pediatrics, and more." },
    { q: "Do you perform surgeries?", a: "Yes, we have state-of-the-art operation theaters for various surgical procedures across all departments." },
    { q: "Are follow-up consultations free?", a: "Follow-up consultations within 7 days of the initial visit are complimentary for the same condition." },
    { q: "What diagnostic facilities are available?", a: "We have in-house pathology, radiology (X-ray, CT, MRI), ECG, echo, ultrasound, and more." },
    { q: "Do you offer preventive health checkup packages?", a: "Yes, we offer comprehensive health checkup packages starting from ₹1,999 including blood work, cardiac screening, and more." },
  ],
  Pricing: [
    { q: "What are the consultation charges?", a: "General consultation: ₹500, Specialist consultation: ₹800-₹1,500. Free follow-up within 7 days." },
    { q: "Are there any hidden charges?", a: "Absolutely not. We believe in transparent pricing. All costs are communicated upfront before any procedure." },
    { q: "Do you offer free consultations?", a: "We offer free initial consultations for select services. Book through our website to check current offers." },
    { q: "What payment methods do you accept?", a: "We accept cash, all major credit/debit cards, UPI (GPay, PhonePe, Paytm), net banking, and EMI options." },
    { q: "Is there a refund policy?", a: "Yes, unused service charges are fully refundable. Refunds are processed within 5-7 business days." },
  ],
} as const;
