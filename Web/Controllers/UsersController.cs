﻿using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Web.Dto;
using Web.Entities;
using Web.Helpers;
using Web.Services;

namespace Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService userService;
        private readonly IPasswordHasher passwordHasher;
        private readonly JwtConfig jwtConfig;

        public UsersController(IUserService userService,
            IPasswordHasher passwordHasher,
            IOptions<JwtConfig> jwtConfigOptions)
        {
            this.userService = userService;
            this.passwordHasher = passwordHasher;
            this.jwtConfig = jwtConfigOptions.Value;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDto model)
        {
            try
            {
                if (!await userService.IsUsernameAvailableAsync(model.Username))
                    return BadRequest(new { error = $"Username '{model.Username}' is already taken." });

                var user = new User
                { Username = model.Username.ToLower(), DisplayName = model.DisplayName, PasswordHash = passwordHasher.HashPassword(model.Password) };

                await userService.RegisterUserAsync(user);

                return Ok();
            }
            catch (Exception)
            {

                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }


        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate(UserAuthenticateDto model)
        {
            try
            {
                var user = await userService.GetUserByUsernameAsync(model.Username);

                if (user == null)
                    return BadRequest(new { message = "Username is incorrect" });

                if (!passwordHasher.VerifyHashedPassword(model.Password, user.PasswordHash))
                    return BadRequest(new { message = "Password is incorrect" });

                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig.Key));

                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim("username", user.Username),
                    new Claim("displayName", user.DisplayName),
                    new Claim("id", user.Id.ToString()),
                };

                var token = new JwtSecurityToken(
                                jwtConfig.Issuer,
                                jwtConfig.Audience,
                                claims,
                                expires: DateTime.Now.AddDays(7),
                                signingCredentials: credentials);

                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

                return Ok(new
                {
                    user.Id,
                    user.Username,
                    user.DisplayName,
                    Token = tokenString
                });

            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

    }
}
