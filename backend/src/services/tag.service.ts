import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Tag } from "../database/models/tag.model.js";
import { inject } from "@adonisjs/fold";
import { DbID } from "../utils/types.js";
import { generateUUID } from "../database/datasource.js";

@inject()
export class TagService {
  private tagRepository: EntityRepository<Tag>;
  public constructor(private em: EntityManager) {
    this.tagRepository = this.em.getRepository(Tag);
  }

  /**
   * Get all tags from the database
   */
  public async getAllTags(): Promise<Tag[]> {
    return await this.tagRepository.findAll();
  }

  /**
   * Create a new tag
   * @param name name of the tag
   */
  public async createTag(name: string): Promise<Tag> {
    const tag = new Tag();
    tag.id = generateUUID();
    tag.name = name;

    await this.tagRepository.insert(tag);
    return tag;
  }

  /**
   * Find a tag by its id
   * @param id id of the tag to find
   */
  public async findTagById(id: DbID): Promise<Tag | null> {
    return this.tagRepository.findOne({ id });
  }

  /**
   * Find a tag by its name
   * @param name name of the tag
   */
  public async findTagByName(name: string): Promise<Tag | null> {
    return this.tagRepository.findOne({ name });
  }

  /**
   * Delete a tag from the database
   * @param id id of the tag to delete
   */
  public async deleteTag(id: DbID): Promise<void> {
    await this.tagRepository.nativeDelete(id);
  }
}
