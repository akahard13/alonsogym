import React from 'react'
import { Main as RolesMain } from '@/Pages/Roles/Main';
const RolesSection = ({ className = '', auth }) => {
  return (
    <section className={`space-y-6 ${className}`}>
        <RolesMain auth={auth}/>
    </section>
  )
}

export default RolesSection