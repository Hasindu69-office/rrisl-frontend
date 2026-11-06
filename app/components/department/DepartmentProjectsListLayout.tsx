'use client';

import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, Sprout, Users, X } from 'lucide-react';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';
import type { DepartmentCurrentProjectItem, DepartmentCurrentProjectGalleryItem } from './DepartmentCurrentProjectsSection';
import styles from './DepartmentProjectsListLayout.module.css';

interface Props {
  tagText: string;
  titlePart1: string | React.ReactNode;
  titlePart2: string | React.ReactNode;
  projects: DepartmentCurrentProjectItem[];
  containerClassName: string;
  sectionId?: string;
}

interface ActiveGalleryImage {
  image: DepartmentCurrentProjectGalleryItem;
  projectTitle: string;
}

function ProjectImage({ src, alt, className }: { src?: string; alt: string; className: string }) {
  return (
    <span className={`${styles.image} ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className={styles.imageContent}
          sizes="(max-width: 639px) 88px, (max-width: 1023px) 140px, 240px"
          unoptimized={isLocalhostAssetUrl(src)}
        />
      ) : (
        <Sprout className={styles.placeholderIcon} aria-hidden="true" />
      )}
    </span>
  );
}

function ProjectItem({
  project,
  number,
  isOpen,
  onToggle,
  onOpenImage,
}: {
  project: DepartmentCurrentProjectItem;
  number: number;
  isOpen: boolean;
  onToggle: (card: HTMLElement) => void;
  onOpenImage: (image: DepartmentCurrentProjectGalleryItem, projectTitle: string, trigger: HTMLButtonElement) => void;
}) {
  const panelId = `department-project-panel-${project.id}`;
  const triggerId = `department-project-trigger-${project.id}`;
  const featured = project.imageSrc
    ? { src: project.imageSrc, alt: project.imageAlt || project.title }
    : project.gallery?.[0];
  const gallery: DepartmentCurrentProjectGalleryItem[] = [
    ...(featured
      ? [{ id: `${project.id}-featured`, src: featured.src, alt: featured.alt }]
      : []),
    ...(project.gallery || []),
  ].filter((image, index, images) =>
    images.findIndex((candidate) => candidate.src === image.src) === index
  );

  return (
    <article className={`${styles.card} ${isOpen ? styles.open : ''}`}>
      <button
        id={triggerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={(event) => onToggle(event.currentTarget.parentElement as HTMLElement)}
        className={styles.trigger}
      >
        <ProjectImage src={featured?.src} alt={featured?.alt || project.title} className={styles.featuredImage} />
        <span className={styles.number} aria-hidden="true">{String(number).padStart(2, '0')}</span>
        <span className={styles.titleBlock}>
          <span className={styles.projectTitle}>{project.title}</span>
          {project.description ? (
            <span className={styles.descriptionReveal} aria-hidden={!isOpen}>
              <span className={styles.description}>{project.description}</span>
            </span>
          ) : null}
        </span>
        <span className={styles.chevron} aria-hidden="true">
          <ChevronDown size={22} strokeWidth={2.4} />
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={styles.panel}
      >
        <div className={styles.panelInner}>
          <div className={styles.panelContent}>
            {project.researchTeam || gallery.length > 0 ? (
              <div className={styles.detailBar}>
                {project.researchTeam ? (
                  <div className={styles.team}>
                    <Users size={28} strokeWidth={1.8} aria-hidden="true" />
                    <div>
                      <strong>Research Team</strong>
                      <p>{project.researchTeam}</p>
                    </div>
                  </div>
                ) : null}
                {gallery.length > 0 ? (
                  <div className={styles.gallery} aria-label={`${project.title} gallery`}>
                    {gallery.map((image) => (
                      <button
                        type="button"
                        className={styles.galleryImage}
                        key={image.id}
                        aria-label={`View ${image.alt} larger`}
                        onClick={(event) => onOpenImage(image, project.title, event.currentTarget)}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className={styles.imageContent}
                          sizes="(max-width: 639px) 80px, 120px"
                          unoptimized={isLocalhostAssetUrl(image.src)}
                        />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : !project.description ? (
              <p className={styles.emptyDetail}>Project details will be added soon.</p>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function DepartmentProjectsListLayout({
  tagText,
  titlePart1,
  titlePart2,
  projects,
  containerClassName,
  sectionId,
}: Props) {
  const [query, setQuery] = useState('');
  const [openProjectId, setOpenProjectId] = useState<string | null>(projects[0]?.id ?? null);
  const [activeImage, setActiveImage] = useState<ActiveGalleryImage | null>(null);
  const [isLightboxVisible, setIsLightboxVisible] = useState(false);
  const projectsRef = useRef<HTMLDivElement | null>(null);
  const imageTriggerRef = useRef<HTMLButtonElement | null>(null);
  const closeImageRef = useRef<HTMLButtonElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const closeImage = useCallback(() => {
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    setIsLightboxVisible(false);
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 280;
    closeTimerRef.current = window.setTimeout(() => {
      setActiveImage(null);
      closeTimerRef.current = null;
    }, delay);
  }, []);

  useEffect(() => () => {
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
  }, []);

  useEffect(() => {
    if (!activeImage) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeImageRef.current?.focus();
    const frame = window.requestAnimationFrame(() => setIsLightboxVisible(true));

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeImage();
      } else if (event.key === 'Tab') {
        event.preventDefault();
        closeImageRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      if (imageTriggerRef.current?.isConnected) imageTriggerRef.current.focus();
    };
  }, [activeImage, closeImage]);

  const openImage = (image: DepartmentCurrentProjectGalleryItem, projectTitle: string, trigger: HTMLButtonElement) => {
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
    imageTriggerRef.current = trigger;
    setIsLightboxVisible(false);
    setActiveImage({ image, projectTitle });
  };

  const handleToggle = (projectId: string, card: HTMLElement) => {
    const isOpening = openProjectId !== projectId;
    setOpenProjectId(isOpening ? projectId : null);

    if (isOpening) {
      window.requestAnimationFrame(() => {
        const scroller = projectsRef.current;
        if (!scroller) return;

        const top = scroller.scrollTop + card.getBoundingClientRect().top - scroller.getBoundingClientRect().top - 4;
        scroller.scrollTo({ top, behavior: 'auto' });
      });
    }
  };

  const visibleProjects = projects.filter((project) =>
    project.title.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
  );

  return (
    <section id={sectionId} className={styles.section}>
      <svg className={styles.clipDefinition} aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="department-project-featured-shape-compact" clipPathUnits="objectBoundingBox">
            <path d="M .32 0 H .985 C .997 0 1 .015 .995 .04 L .9 .78 C .875 .94 .82 1 .73 1 H .2 C .075 1 0 .87 0 .67 V .55 C 0 .22 .12 0 .32 0 Z" />
          </clipPath>
          <clipPath id="department-project-featured-shape" clipPathUnits="objectBoundingBox">
            <path d="M .27 0 H 1 L .81 .85 C .79 .94 .74 1 .65 1 H .13 C .05 1 0 .96 0 .87 V .26 C 0 .11 .11 0 .27 0 Z" />
          </clipPath>
        </defs>
      </svg>
      <div className={`${styles.container} ${containerClassName}`}>
        <header className={styles.header} data-department-reveal>
          <GradientTag text={tagText} backgroundColor="transparent" padding="px-5 py-1.5" />
          <GradientTitle
            part1={titlePart1}
            part2={titlePart2}
            lineBreak={false}
            part1Color="dark-green"
            size="custom"
            customSize="var(--projects-heading-size)"
            align="center"
            className={styles.heading}
          />
        </header>

        <div className={styles.toolbar} data-department-reveal>
          <label className={styles.searchBox}>
            <Search size={23} strokeWidth={2.3} aria-hidden="true" />
            <span className={styles.srOnly}>Search research projects</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search research projects..."
              className={styles.searchInput}
            />
          </label>
        </div>

        {visibleProjects.length > 0 ? (
          <div ref={projectsRef} className={`${styles.projects} location-details-scroll`} data-department-reveal tabIndex={0} role="region" aria-label="Research projects">
            {visibleProjects.map((project, index) => (
              <ProjectItem
                key={project.id}
                project={project}
                number={index + 1}
                isOpen={openProjectId === project.id}
                onToggle={(card) => handleToggle(project.id, card)}
                onOpenImage={openImage}
              />
            ))}
          </div>
        ) : (
          <p className={styles.noResults} role="status">No research projects match “{query.trim()}”.</p>
        )}
      </div>
      {activeImage && createPortal(
        <div
          className={`${styles.lightbox} ${isLightboxVisible ? styles.lightboxVisible : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label={`${activeImage.projectTitle} photo viewer`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeImage();
          }}
        >
          <div className={styles.lightboxContent}>
            <div className={styles.lightboxHeader}>
              <p>{activeImage.projectTitle}</p>
              <button
                ref={closeImageRef}
                type="button"
                className={styles.lightboxClose}
                aria-label="Close photo viewer"
                onClick={closeImage}
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>
            <div className={styles.lightboxImage}>
              <Image
                src={activeImage.image.src}
                alt={activeImage.image.alt}
                fill
                className={styles.lightboxImageContent}
                sizes="100vw"
                unoptimized={isLocalhostAssetUrl(activeImage.image.src)}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
