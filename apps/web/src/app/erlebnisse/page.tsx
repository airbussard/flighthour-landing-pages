import { redirect } from 'next/navigation'

// Redirect to search page with all experiences
export default function ExperiencesPage() {
  redirect('/suche')
}
