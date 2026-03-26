import {
  Plus, ChevronDown, ChevronRight, BookOpen,
  FileText, Edit, Trash2, Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useManageContext } from '../../../Context/creator/ManageContext'

export function ManageSidebar() {
  const {
    sections, lessonsMap, expandedSections, activeView,
    toggleSection, setActiveView,
    openAddSection, openEditSection, handleDeleteSection,
    openAddLesson, openEditLesson, handleDeleteLesson,
  } = useManageContext()

  return (
    <aside className="w-72 bg-white border-r border-beige-200 flex flex-col overflow-hidden shrink-0">
      <div className="p-4 border-b border-beige-100 flex items-center justify-between">
        <span className="text-sm font-semibold text-beige-700">Konten Kursus</span>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-xs text-merah-600 hover:bg-merah-50"
          onClick={openAddSection}
          data-testid="add-section-btn"
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Seksi
        </Button>
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

        {sections.length === 0 ? (
          <p className="text-xs text-beige-400 px-3 py-4 text-center">
            Belum ada seksi. Klik + Seksi untuk mulai.
          </p>
        ) : (
          sections.map((section) => {
            const isExpanded = expandedSections.has(section.id)
            const lessons = lessonsMap[section.id] || []
            const isActiveSection = activeView.type === 'section' && activeView.sectionId === section.id

            return (
              <div key={section.id} className="mb-1">
                <div
                  className={`group flex items-center gap-1 px-2 py-1.5 rounded-lg transition-colors ${
                    isActiveSection ? 'bg-beige-100' : 'hover:bg-beige-50'
                  }`}
                  data-testid={`section-item-${section.id}`}
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="flex items-center gap-1.5 flex-1 min-w-0 text-left"
                    data-testid={`section-toggle-${section.id}`}
                  >
                    {isExpanded
                      ? <ChevronDown className="h-3.5 w-3.5 text-beige-400 shrink-0" />
                      : <ChevronRight className="h-3.5 w-3.5 text-beige-400 shrink-0" />
                    }
                    <BookOpen className="h-3.5 w-3.5 text-beige-500 shrink-0" />
                    <span className="text-sm text-beige-800 font-medium truncate">{section.title}</span>
                    <span className="text-xs text-beige-400 shrink-0 ml-auto">{section.lessonCount}</span>
                  </button>

                  <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                    <button
                      onClick={() => openEditSection(section)}
                      className="p-1 rounded hover:bg-beige-200 text-beige-500 hover:text-beige-700"
                      title="Edit seksi"
                      data-testid={`section-edit-btn-${section.id}`}
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="p-1 rounded hover:bg-merah-100 text-beige-500 hover:text-merah-600"
                      title="Hapus seksi"
                      data-testid={`section-delete-btn-${section.id}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => openAddLesson(section.id)}
                      className="p-1 rounded hover:bg-hijau-100 text-beige-500 hover:text-hijau-600"
                      title="Tambah pelajaran"
                      data-testid={`section-add-lesson-btn-${section.id}`}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
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
                      Tambah pelajaran
                    </button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </nav>
    </aside>
  )
}
