using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace API.Course.DAL.Context;

public partial class CourseContext : DbContext
{
    public CourseContext()
    {
    }

    public CourseContext(DbContextOptions<CourseContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Course> Courses { get; set; }

    public virtual DbSet<CourseAdditional> CourseAdditionals { get; set; }

    public virtual DbSet<CourseAdditionalType> CourseAdditionalTypes { get; set; }

    public virtual DbSet<CourseTag> CourseTags { get; set; }

    public virtual DbSet<Language> Languages { get; set; }

    public virtual DbSet<Lesson> Lessons { get; set; }

    public virtual DbSet<Level> Levels { get; set; }

    public virtual DbSet<Module> Modules { get; set; }

    public virtual DbSet<Tag> Tags { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=ConnectionStrings:DefaultConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("Category");

            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.ImageUrl)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
            entity.Property(e => e.Name)
                .HasMaxLength(200)
                .IsUnicode(false);

            entity.HasOne(d => d.Parent).WithMany(p => p.InverseParent)
                .HasForeignKey(d => d.ParentId)
                .HasConstraintName("FK_Category_Category");
        });

        modelBuilder.Entity<Course>(entity =>
        {
            entity.ToTable("Course");

            entity.Property(e => e.BasePrice).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.Description).IsUnicode(false);
            entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ThumbnailImageUrl)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .IsUnicode(false);

            entity.HasOne(d => d.Category).WithMany(p => p.Courses)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Course_Category");

            entity.HasOne(d => d.Language).WithMany(p => p.Courses)
                .HasForeignKey(d => d.LanguageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Course_Language");

            entity.HasOne(d => d.Level).WithMany(p => p.Courses)
                .HasForeignKey(d => d.LevelId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Course_Level");
        });

        modelBuilder.Entity<CourseAdditional>(entity =>
        {
            entity.ToTable("CourseAdditional");

            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .IsUnicode(false);

            entity.HasOne(d => d.CourseAdditionalType).WithMany(p => p.CourseAdditionals)
                .HasForeignKey(d => d.CourseAdditionalTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CourseAdditional_CourseAdditionalType");

            entity.HasOne(d => d.Course).WithMany(p => p.CourseAdditionals)
                .HasForeignKey(d => d.CourseId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CourseAdditional_Course");
        });

        modelBuilder.Entity<CourseAdditionalType>(entity =>
        {
            entity.ToTable("CourseAdditionalType");

            entity.Property(e => e.AdditionalType)
                .HasMaxLength(200)
                .IsUnicode(false);
        });

        modelBuilder.Entity<CourseTag>(entity =>
        {
            entity.HasKey(e => e.CourseTagsId);

            entity.HasOne(d => d.Course).WithMany(p => p.CourseTags)
                .HasForeignKey(d => d.CourseId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CourseTags_Course");

            entity.HasOne(d => d.Tags).WithMany(p => p.CourseTags)
                .HasForeignKey(d => d.TagsId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CourseTags_Tags");
        });

        modelBuilder.Entity<Language>(entity =>
        {
            entity.ToTable("Language");

            entity.Property(e => e.Name)
                .HasMaxLength(200)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Lesson>(entity =>
        {
            entity.ToTable("Lesson");

            entity.Property(e => e.Description).IsUnicode(false);
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.VideoUrl)
                .HasMaxLength(200)
                .IsUnicode(false);

            entity.HasOne(d => d.Module).WithMany(p => p.Lessons)
                .HasForeignKey(d => d.ModuleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Lesson_Module");
        });

        modelBuilder.Entity<Level>(entity =>
        {
            entity.ToTable("Level");

            entity.Property(e => e.Name)
                .HasMaxLength(200)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Module>(entity =>
        {
            entity.ToTable("Module");

            entity.Property(e => e.Description).IsUnicode(false);
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .IsUnicode(false);

            entity.HasOne(d => d.Course).WithMany(p => p.Modules)
                .HasForeignKey(d => d.CourseId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Module_Course");
        });

        modelBuilder.Entity<Tag>(entity =>
        {
            entity.HasKey(e => e.TagsId);

            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
