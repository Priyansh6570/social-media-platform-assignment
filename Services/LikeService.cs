using Microsoft.EntityFrameworkCore;
using Social_Media.Models;

namespace Social_Media.Services;

public class LikeService
{
    private readonly ApplicationDbContext _context;

    public LikeService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Like>> GetAllLikesAsync()
    {
        return await _context.Likes.ToListAsync();
    }

    public async Task<IEnumerable<Like>> GetLikesByUserIdAsync(int userId)
    {
        return await _context.Likes.Where(like => like.UserID == userId).ToListAsync();
    }

    public async Task<IEnumerable<Like>> GetLikesByPostIdAsync(int postId)
    {
        return await _context.Likes.Where(like => like.PostID == postId).ToListAsync();
    }

    public async Task<int> GetLikeCountByPostIdAsync(int postId)
    {
        return await _context.Likes.CountAsync(like => like.PostID == postId);
    }

    public async Task<int> GetLikeCountByUserIdAsync(int userId)
    {
        return await _context.Likes.CountAsync(like => like.UserID == userId);
    }

    public async Task<Like> GetLikeByPostAndUserAsync(int postId, int userId)
    {
        return await _context.Likes.FirstOrDefaultAsync(like => like.PostID == postId && like.UserID == userId);
    }

    public async Task<Like> AddLikeAsync(Like like)
    {
        _context.Likes.Add(like);
        await _context.SaveChangesAsync();
        return like;
    }

    public async Task<bool> DeleteLikeAsync(int likeId)
    {
        var like = await _context.Likes.FindAsync(likeId);
        if (like == null)
        {
            return false;
        }

        _context.Likes.Remove(like);
        await _context.SaveChangesAsync();
        return true;
    }
}
