using Microsoft.AspNetCore.Mvc;
using Social_Media.Models;
using Social_Media.Services;

namespace Social_Media.Controllers;

[ApiController]
[Route("[controller]")]
public class LikeController : ControllerBase
{
    private readonly LikeService _likeService;

    public LikeController(LikeService likeService)
    {
        _likeService = likeService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Like>>> GetAllLikes()
    {
        var likes = await _likeService.GetAllLikesAsync();
        return Ok(likes);
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<Like>>> GetLikesByUser(int userId)
    {
        var likes = await _likeService.GetLikesByUserIdAsync(userId);
        return Ok(likes);
    }

    [HttpGet("post/{postId}")]
    public async Task<ActionResult<IEnumerable<Like>>> GetLikesByPost(int postId)
    {
        var likes = await _likeService.GetLikesByPostIdAsync(postId);
        return Ok(likes);
    }

    [HttpGet("post/{postId}/count")]
    public async Task<ActionResult<int>> GetLikeCountByPost(int postId)
    {
        var likeCount = await _likeService.GetLikeCountByPostIdAsync(postId);
        return Ok(likeCount);
    }

    [HttpGet("user/{userId}/count")]
    public async Task<ActionResult<int>> GetLikeCountByUser(int userId)
    {
        var likeCount = await _likeService.GetLikeCountByUserIdAsync(userId);
        return Ok(likeCount);
    }

    [HttpGet("Post/{postID}/User/{userID}")]
    public async Task<ActionResult<Like>> GetLikesByPostAndUser(int postID, int userID)
    {
        var like = await _likeService.GetLikeByPostAndUserAsync(postID, userID);
        if (like == null)
        {
        // Console.WriteLine("like err check : ", like);
            return NotFound();
        }

        return Ok(like);
    }

    [HttpPost]
    public async Task<ActionResult<Like>> AddLike(Like like)
    {
        var newLike = await _likeService.AddLikeAsync(like);
        return CreatedAtAction(nameof(GetAllLikes), new { id = newLike.LikeID }, newLike);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLike(int id)
    {
        var success = await _likeService.DeleteLikeAsync(id);
        if (!success)
        {
            return NotFound();
        }

        return NoContent();
    }
}
