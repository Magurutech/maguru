import { useRef, useEffect, useState } from 'react'
import {
  Plus, ChevronDown, ChevronRight, Folder, FolderOpen,
  FileText, MoreHorizontal, Edit, Trash2, Settings,
} from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useManageContext } from '../../../Context/creator/ManageContext'

export function ManageSidebar() {
  const {
    sections, lessonsMap, expandedSections, activeView,
    toggleSection, setActiveView,
    isAddingSection, newSectionTitle, setNewSectionTitle,
    startAddingSection, cancelAddingSection, confirmAddSection, updateSectionTitle,
    handleDeleteSection,
    openAddLesson, openEditLesson, handleDeleteLesson,
  } = useManageContext()

  const inlineInputRef = useRef<HTMLInputElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [editingSectionTitle, setEditingSectionTitle] = useState('')

  useEffect(() => {
    if (isAddingSection) inlineInputRef.current?.focus()
  }, [isAddingSection])

  useEffect(() => {
    if (editingSectionId) editInputRef.current?.select()
  }, [editingSectionId])

  const handleInlineKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); confirmAddSection() }
    if (e.key === 'Escape') { e.preventDefault(); cancelAddingSection() }
  }

  const handleInlineBlur = () => {
    if (newSectionTitle.trim()) confirmAddSection()
    else cancelAddingSection()
  }

  const startEditSection = (section: { id: string; title: string }) => {
    setOpenMenuId(null)
    setEditingSectionId(section.id)
    setEditingSectionTitle(section.title)
  }

  const cancelEditSection = () => {
    setEditingSectionId(null)
    setEditingSectionTitle('')
  }

  const confirmEditSection = async (sectionId: string, oldTitle: string) => {
    const title = editingSectionTitle.trim()
    setEditingSectionId(null)
    setEditingSectionTitle('')
    if (!title || title === oldTitle) return
    await updateSectionTitle(sectionId, title, oldTitle)
  }

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, sectionId: string, oldTitle: string) => {
    if (e.key === 'Enter') { e.preventDefault(); confirmEditSection(sectionId, oldTitle) }
    if (e.key === 'Escape') { e.preventDefault(); cancelEditSection() }
  }

  return (
    <aside className="w-72 bg-white border-r border-beige-200 flex flex-col overflow-hidden shrink-0">
      <div className="p-4 border-b border-beige-100">
        <span className="text-sm font-semibold text-beige-700">Konten Kursus</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <button
          onClick={() => setActiveView({ type: 'overview' })}
          data-testid="sidebar-overview-btn"
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors mb-1 ${
            activeView.type === 'overview'
              ? 'bg-merah-50 text-merah-700 font-medium'
              : 'text-beige-700 hover:bg-beige-50'
          }`}
        >
          <Settings className="h-4 w-4 shrink-0" />
          Overview Kursus
        </button>

        {sections.length === 0 && !isAddingSection && (
          <p className="text-xs text-beige-400 px-3 py-4 text-center">
            Belum ada seksi. Klik + Tambah Seksi untuk mulai.
          </p>
        )}

        {sections.map((section) => {
          const isExpanded = expandedSections.has(section.id)
          const lessons = lessonsMap[section.id] || []
          const isActiveSection = activeView.type === 'section' && activeView.sectionId === section.id
          const isPending = section.id.startsWith('temp-')
          const isMenuOpen = openMenuId === section.id
          const isEditing = editingSectionId === section.id

          return (
            <div key={section.id} className={`mb-1 ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
              <div
                className={`group flex items-center gap-1 px-2 py-1.5 rounded-lg transition-colors ${
                  isActiveSection || isMenuOpen || isEditing ? 'bg-beige-100' : 'hover:bg-beige-50'
                }`}
                data-testid={`section-item-${section.id}`}
              >
                {/* Chevron + folder icon */}
                <button
                  onClick={() => !isEditing && toggleSection(section.id)}
                  className="flex items-center gap-1 shrink-0"
                  tabIndex={isEditing ? -1 : 0}
                >
                  {isExpanded
                    ? <ChevronDown className="h-3.5 w-3.5 text-beige-400" />
                    : <ChevronRight className="h-3.5 w-3.5 text-beige-400" />
                  }
                  {isExpanded
                    ? <FolderOpen className="h-3.5 w-3.5 text-beige-500" />
                    : <Folder className="h-3.5 w-3.5 text-beige-500" />
                  }
                </button>

                {/* Title — inline input when editing, span otherwise */}
                {isEditing ? (
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editingSectionTitle}
                    onChange={(e) => setEditingSectionTitle(e.target.value)}
                    onKeyDown={(e) => handleEditKeyDown(e, section.id, section.title)}
                    onBlur={() => confirmEditSection(section.id, section.title)}
                    className="flex-1 min-w-0 text-sm font-medium bg-white border border-merah-300 rounded px-1.5 py-0.5 outline-none focus:ring-1 focus:ring-merah-300 text-beige-800"
                    maxLength={200}
                    data-testid={`section-edit-input-${section.id}`}
                  />
                ) : (
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="flex-1 min-w-0 text-left flex items-center gap-1"
                    data-testid={`section-toggle-${section.id}`}
                  >
                    <span className="text-sm text-beige-800 font-medium truncate">{section.title}</span>
                    <span className="text-xs text-beige-400 shrink-0 ml-auto">{section.lessonCount}</span>
                  </button>
                )}

                {/* ⋯ menu — hidden when editing */}
                {!isEditing && (
                  <div className={`items-center shrink-0 ${isMenuOpen ? 'flex' : 'hidden group-hover:flex'}`}>
                    <DropdownMenu
                      open={isMenuOpen}
                      onOpenChange={(open) => setOpenMenuId(open ? section.id : null)}
                    >
                      <DropdownMenuTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className={`p-1 rounded text-beige-400 hover:text-beige-700 transition-colors ${
                            isMenuOpen ? 'bg-beige-200 text-beige-700' : 'hover:bg-beige-200'
                          }`}
                          title="Opsi seksi"
                          data-testid={`section-menu-btn-${section.id}`}
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start" className="w-44">
                        <DropdownMenuItem
                          onClick={() => startEditSection(section)}
                          data-testid={`section-edit-btn-${section.id}`}
                        >
                          <Edit className="h-3.5 w-3.5 mr-2" />
                          Edit 
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openAddLesson(section.id)}
                          data-testid={`section-add-lesson-btn-${section.id}`}
                        >
                          <Plus className="h-3.5 w-3.5 mr-2" />
                          Tambah 
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDeleteSection(section.id)}
                          data-testid={`section-delete-btn-${section.id}`}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Hapus Seksi
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>

              {isExpanded && (
                <div className="ml-6 mt-0.5 space-y-0.5">
                  {lessons.map((lesson) => {
                    const isActiveLesson = activeView.type === 'lesson' && activeView.lessonId === lesson.id
                    return (
                      <div
                        key={lesson.id}
                        className={`group flex items-center gap-1 px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          isActiveLesson ? 'bg-merah-50 text-merah-700' : 'hover:bg-beige-50 text-beige-700'
                        }`}
                        onClick={() => setActiveView({ type: 'lesson', sectionId: section.id, lessonId: lesson.id })}
                        data-testid={`lesson-item-${lesson.id}`}
                      >
                        <FileText className="h-3.5 w-3.5 shrink-0 text-beige-400" />
                        <span className="text-xs flex-1 truncate">{lesson.title}</span>
                        <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                          <button
                            onClick={(e) => { e.stopPropagation(); openEditLesson(lesson, section.id) }}
                            className="p-1 rounded hover:bg-beige-200 text-beige-400 hover:text-beige-700"
                            title="Edit pelajaran"
                            data-testid={`lesson-edit-btn-${lesson.id}`}
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteLesson(section.id, lesson.id) }}
                            className="p-1 rounded hover:bg-merah-100 text-beige-400 hover:text-merah-600"
                            title="Hapus pelajaran"
                            data-testid={`lesson-delete-btn-${lesson.id}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                  <button
                    onClick={() => openAddLesson(section.id)}
                    className="w-full flex items-center gap-1.5 px-2 py-1 rounded text-xs text-beige-400 hover:text-hijau-600 hover:bg-hijau-50 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    Tambah 
                  </button>
                </div>
              )}
            </div>
          )
        })}

        {/* Inline new section input */}
        {isAddingSection && (
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-beige-50 mb-1">
            <ChevronRight className="h-3.5 w-3.5 text-beige-300 shrink-0" />
            <Folder className="h-3.5 w-3.5 text-beige-400 shrink-0" />
            <input
              ref={inlineInputRef}
              type="text"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              onKeyDown={handleInlineKeyDown}
              onBlur={handleInlineBlur}
              placeholder="Nama seksi..."
              className="flex-1 text-sm bg-transparent outline-none text-beige-800 placeholder:text-beige-300"
              data-testid="inline-section-input"
            />
          </div>
        )}

        <button
          onClick={startAddingSection}
          className="w-full flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-beige-700 hover:text-merah-600 hover:bg-merah-50 transition-colors mt-1"
          data-testid="add-section-btn"
        >
          <Plus className="h-3.5 w-3.5" />
          Tambah Seksi
        </button>
      </nav>
    </aside>
  )
}
