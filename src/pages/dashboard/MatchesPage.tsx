import { MatchCard } from '../../components/dashboard/matches/MatchCard'
import { MatchesEmptyState } from '../../components/dashboard/matches/MatchesEmptyState'
import { MatchesFilters } from '../../components/dashboard/matches/MatchesFilters'
import { DashboardLayout } from '../../components/layout'
import { useAuth } from '../../context/AuthContext'
import { useMatchesPage } from '../../hooks/useMatchesPage'

export function MatchesPage() {
  const { currentUser } = useAuth()
  const {
    userType,
    loading,
    activeView,
    setActiveView,
    displayMode,
    setDisplayMode,
    searchTerm,
    setSearchTerm,
    filteredMatches,
    handleSaveSuggestion,
    handleDismissSuggestion,
    removeSavedSuggestion,
    savedSuggestions
  } = useMatchesPage({
    userId: currentUser?.id ?? null,
    userType: currentUser?.type ?? null
  })

  const handleExpressInterest = (matchId: string) => {
    if (savedSuggestions.includes(matchId)) {
      removeSavedSuggestion(matchId)
    } else {
      handleSaveSuggestion(matchId)
    }
  }

  return (
    <DashboardLayout userType={userType}>
      <div className='flex flex-col'>
        <div className='mb-4'>
          <h1 className='text-2xl font-bold text-gray-900'>Matches</h1>
          <p className='text-gray-600'>
            {activeView === 'confirmed'
              ? 'View and manage your confirmed matches'
              : 'Discover new AI-suggested matches based on your profile'}
          </p>
        </div>
        <MatchesFilters
          activeView={activeView}
          onViewChange={setActiveView}
          displayMode={displayMode}
          onDisplayModeChange={setDisplayMode}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
        />
        {loading ? (
          <div className='flex justify-center items-center h-64'>
            <div className='text-gray-500'>Loading matches...</div>
          </div>
        ) : filteredMatches.length === 0 ? (
          <MatchesEmptyState
            activeView={activeView}
            onCtaClick={() => setActiveView('suggested')}
          />
        ) : (
          <div
            className={
              displayMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                activeView={activeView}
                userType={userType}
                isSaved={savedSuggestions.includes(match.id)}
                onSave={handleSaveSuggestion}
                onDismiss={handleDismissSuggestion}
                onExpressInterest={handleExpressInterest}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
