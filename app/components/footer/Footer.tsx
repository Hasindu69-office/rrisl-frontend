import React from 'react';
import FooterNewsletter from './FooterNewsletter';
import FooterMain from './FooterMain';

export default function Footer() {
  return (
    <div className="-mt-[200px] md:-mt-[236px] lg:-mt-[248px]">
      {/* Newsletter card overlaps both the section above and the main footer */}
      <div className="-mb-[270px]">
        <FooterNewsletter />
      </div>
      <FooterMain />
    </div>
  );
}



