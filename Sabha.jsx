import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Sabha() {
  const [posts, setPosts]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [content, setContent]   = useState('')
  const [posting, setPosting]   = useState(false)

  useEffect(() => {
    supabase
      .from('forum_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPosts(data || [])
        setLoading(false)
      })
  }, [])

  async function submitPost() {
    if (!content.trim()) return
    setPosting(true)
    const { data: newPost, error } = await supabase
      .from('forum_posts')
      .insert({
        user_name: 'Citizen',
        user_handle: '@citizen_pune',
        content: content.trim(),
        tag: 'Local',
        is_official: false,
        likes: 0,
        ward: 'Ward 12',
      })
      .select()
      .single()

    if (!error && newPost) {
      setPosts(prev => [newPost, ...prev])
    }
    setContent('')
    setPosting(false)
  }

  async function handleLike(post) {
    const newCount = post.likes + 1
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes: newCount } : p))
    await supabase.from('forum_posts').update({ likes: newCount }).eq('id', post.id)
  }

  if (loading) return <div className="loading">LOADING SABHA FEED</div>

  return (
    <div>
      <p className="label-xs" style={{ marginBottom: 6 }}>PUBLIC ASSEMBLY</p>
      <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Civic Discourse — Pune</h2>
      <p style={{ color: 'var(--text-mid)', fontSize: 14, marginBottom: 20 }}>
        Open civic forum. Officials respond publicly. Everything is on record.
      </p>

      {/* Post composer */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-hi)',
        borderRadius: 6,
        padding: '14px 16px',
        marginBottom: 20,
      }}>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="What's happening in your ward? Use #Ward12 or #CIVITAS to amplify..."
          rows={3}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            color: 'var(--text)',
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            outline: 'none',
            resize: 'none',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)' }}>
            {content.length}/500
          </span>
          <button
            onClick={submitPost}
            disabled={posting || !content.trim()}
            className="btn btn-warning fw-bold btn-sm"
            style={{ opacity: posting ? 0.6 : 1 }}
          >
            {posting ? 'POSTING...' : 'POST TO SABHA →'}
          </button>
        </div>
      </div>

      {posts.length === 0 && <div className="empty">No posts yet. Be the first to speak.</div>}

      {/* Feed */}
      {posts.map(post => (
        <PostCard key={post.id} post={post} onLike={() => handleLike(post)} />
      ))}
    </div>
  )
}

function PostCard({ post, onLike }) {
  const isOfficial = post.is_official

  return (
    <div style={{
      background: isOfficial ? '#0A130A' : 'var(--bg-card)',
      border: `1px solid ${isOfficial ? '#1D3A1D' : 'var(--border)'}`,
      borderLeft: isOfficial ? '3px solid var(--green)' : '3px solid var(--border)',
      borderRadius: 6,
      padding: '14px 16px',
      marginBottom: 10,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Avatar */}
          <div style={{
            width: 32, height: 32,
            borderRadius: '50%',
            background: isOfficial ? '#0D2010' : '#1A1A1A',
            border: `1px solid ${isOfficial ? 'var(--green)' : 'var(--border-hi)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            fontWeight: 700,
            color: isOfficial ? 'var(--green)' : 'var(--text-mid)',
            flexShrink: 0,
          }}>
            {post.user_name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: isOfficial ? 'var(--green)' : 'var(--text)' }}>
              {post.user_name}
              {isOfficial && (
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 8,
                  background: '#0A2510',
                  color: 'var(--green)',
                  border: '1px solid #1D3A1D',
                  borderRadius: 2,
                  padding: '1px 5px',
                  marginLeft: 6,
                }}>
                  ✓ OFFICIAL
                </span>
              )}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)' }}>
              {post.user_handle}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TagChip tag={post.tag} />
          {post.created_at && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-dim)' }}>
              {new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text)', marginBottom: 12 }}>
        {post.content}
      </p>

      {/* Footer */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <button
          onClick={onLike}
          className="btn btn-link p-0 text-muted"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            textDecoration: 'none',
          }}
        >
          <span style={{ fontSize: 13 }}>♥</span> {post.likes}
        </button>
        {post.ward && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)' }}>
            📍 {post.ward}
          </span>
        )}
      </div>
    </div>
  )
}

function TagChip({ tag }) {
  const isOfficial = tag === 'Official Response'
  const isCritical = tag === 'Critical'
  const color = isOfficial ? 'var(--green)' : isCritical ? 'var(--red)' : 'var(--text-dim)'
  const bg = isOfficial ? '#021A0A' : isCritical ? '#1A0000' : '#141414'

  return (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 8,
      letterSpacing: '.08em',
      padding: '2px 7px',
      borderRadius: 2,
      background: bg,
      color: color,
    }}>
      {tag}
    </span>
  )
}
