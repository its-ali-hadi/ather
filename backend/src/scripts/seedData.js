const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

const seedData = async () => {
  let connection;

  try {
    connection = await pool.getConnection();
    console.log('🌱 Starting database seeding...\n');

    // Check if data already exists
    const [existingUsers] = await connection.query('SELECT COUNT(*) as count FROM users');
    if (existingUsers[0].count > 0) {
      console.log('⚠️  Database already contains data. Skipping seed...');
      return;
    }

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Seed Users
    console.log('👥 Seeding users...');
    const users = [
      {
        phone: '07701234567',
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
        bio: 'مطور تطبيقات | مهتم بالتقنية والبرمجة',
        is_verified: true,
        role: 'user'
      },
      {
        phone: '07712345678',
        name: 'سارة الفنانة',
        email: 'sara@example.com',
        bio: 'فنانة تشكيلية | أحب الألوان المائية',
        is_verified: true,
        role: 'user'
      },
      {
        phone: '07723456789',
        name: 'أحمد الكاتب',
        email: 'ahmed.writer@example.com',
        bio: 'كاتب وروائي | أحب القصص القصيرة',
        is_verified: true,
        role: 'user'
      },
      {
        phone: '07734567890',
        name: 'محمد الرياضي',
        email: 'mohamed@example.com',
        bio: 'مدرب لياقة بدنية | نمط حياة صحي',
        is_verified: true,
        role: 'user'
      },
      {
        phone: '07745678901',
        name: 'ليلى المسافرة',
        email: 'layla@example.com',
        bio: 'عاشقة السفر والمغامرات | 45 دولة',
        is_verified: true,
        role: 'user'
      },
      {
        phone: '07756789012',
        name: 'خالد رائد الأعمال',
        email: 'khaled@example.com',
        bio: 'رائد أعمال | مؤسس 3 شركات ناشئة',
        is_verified: true,
        role: 'user'
      },
      {
        phone: '07767890123',
        name: 'فاطمة المطورة',
        email: 'fatima@example.com',
        bio: 'مطورة Full Stack | React & Node.js',
        is_verified: true,
        role: 'user'
      },
      {
        phone: '07778901234',
        name: 'عمر المصمم',
        email: 'omar@example.com',
        bio: 'مصمم جرافيك | UI/UX Designer',
        is_verified: true,
        role: 'user'
      },
      {
        phone: '07789012345',
        name: 'مدير النظام',
        email: 'admin@athar.com',
        bio: 'مدير منصة أثر',
        is_verified: true,
        role: 'admin'
      }
    ];

    const userIds = [];
    for (const user of users) {
      const [result] = await connection.query(
        'INSERT INTO users (phone, name, email, password, bio, is_verified, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [user.phone, user.name, user.email, hashedPassword, user.bio, user.is_verified, user.role]
      );
      userIds.push(result.insertId);
    }
    console.log(`✅ Created ${userIds.length} users\n`);

    // Seed Posts
    console.log('📝 Seeding posts...');
    const posts = [
      {
        user_id: userIds[0],
        type: 'text',
        title: 'تجربتي في تعلم React Native',
        content: 'بدأت رحلتي في تعلم React Native منذ شهرين، وأود مشاركة تجربتي معكم. التحديات كانت كثيرة في البداية، لكن المجتمع الداعم والموارد المتاحة ساعدتني كثيراً. أنصح المبتدئين بالتركيز على الأساسيات أولاً قبل الانتقال للمكتبات المتقدمة.',
        category: 'تقنية'
      },
      {
        user_id: userIds[1],
        type: 'text',
        title: 'لوحتي الجديدة - غروب الشمس',
        content: 'لوحة جديدة رسمتها بالألوان المائية، مستوحاة من غروب الشمس على شاطئ البحر. استغرقت مني 3 أيام لإكمالها.',
        category: 'فن'
      },
      {
        user_id: userIds[2],
        type: 'text',
        title: 'قصة قصيرة: الطريق',
        content: 'كان الطريق طويلاً، والليل حالكاً. سار وحيداً، لا يرافقه سوى صوت خطواته على الحصى. في نهاية الطريق، كان هناك نور خافت يلوح في الأفق، كأنه يدعوه للمضي قدماً...',
        category: 'أدب'
      },
      {
        user_id: userIds[3],
        type: 'text',
        title: 'روتيني الصباحي للياقة',
        content: 'أشارك معكم روتيني الصباحي الذي ساعدني على خسارة 15 كيلو في 3 أشهر. التمارين بسيطة ولا تحتاج معدات!',
        category: 'رياضة'
      },
      {
        user_id: userIds[4],
        type: 'text',
        title: 'رحلتي إلى اليابان',
        content: 'زيارة طوكيو كانت حلماً تحقق! المدينة مذهلة بتناقضاتها بين التقليد والحداثة. تجربة لا تُنسى.',
        category: 'سفر'
      },
      {
        user_id: userIds[5],
        type: 'text',
        title: '5 دروس تعلمتها من فشل مشروعي الأول',
        content: 'فشل مشروعي الأول كان أفضل معلم لي. تعلمت أهمية دراسة السوق، الاستماع للعملاء، وعدم الاستسلام. اليوم، مشروعي الثاني ينمو بشكل مستمر بفضل هذه الدروس.',
        category: 'أعمال'
      },
      {
        user_id: userIds[6],
        type: 'text',
        title: 'أفضل 10 مصادر لتعلم البرمجة مجاناً',
        content: 'جمعت لكم أفضل المصادر المجانية لتعلم البرمجة من الصفر. هذه المواقع ساعدتني شخصياً في بداية مسيرتي.',
        category: 'تقنية'
      },
      {
        user_id: userIds[7],
        type: 'text',
        title: 'تصميم شعار جديد لمقهى محلي',
        content: 'سعيد بمشاركة آخر أعمالي - تصميم هوية بصرية كاملة لمقهى محلي. التحدي كان في دمج الطابع التقليدي مع لمسة عصرية.',
        category: 'فن'
      },
      {
        user_id: userIds[0],
        type: 'text',
        title: 'نصائح لتحسين أداء تطبيقات React',
        content: 'بعد سنوات من العمل مع React، جمعت أهم النصائح لتحسين الأداء: استخدام React.memo، تجنب Re-renders غير الضرورية، واستخدام lazy loading للمكونات الكبيرة.',
        category: 'تقنية'
      },
      {
        user_id: userIds[1],
        type: 'text',
        title: 'تقنيات الرسم بالألوان الزيتية',
        content: 'الألوان الزيتية تتطلب صبراً وممارسة. أهم نصيحة: ابدأ بطبقات رقيقة واترك كل طبقة تجف قبل إضافة التالية.',
        category: 'فن'
      },
      {
        user_id: userIds[3],
        type: 'text',
        title: 'أهمية تمارين الإحماء',
        content: 'تمارين الإحماء ليست اختيارية! 10 دقائق من الإحماء يمكن أن تمنع إصابات خطيرة وتحسن أداءك الرياضي بشكل كبير.',
        category: 'رياضة'
      },
      {
        user_id: userIds[4],
        type: 'text',
        title: 'نصائح للسفر بميزانية محدودة',
        content: 'السفر لا يجب أن يكون مكلفاً! احجز مبكراً، استخدم تطبيقات المقارنة، وفكر في الإقامة في نُزل بدلاً من الفنادق.',
        category: 'سفر'
      }
    ];

    const postIds = [];
    for (const post of posts) {
      const [result] = await connection.query(
        'INSERT INTO posts (user_id, type, title, content, category) VALUES (?, ?, ?, ?, ?)',
        [post.user_id, post.type, post.title, post.content, post.category]
      );
      postIds.push(result.insertId);
    }
    console.log(`✅ Created ${postIds.length} posts\n`);

    // Seed Likes
    console.log('❤️  Seeding likes...');
    const likes = [
      { post_id: postIds[0], user_id: userIds[1] },
      { post_id: postIds[0], user_id: userIds[2] },
      { post_id: postIds[0], user_id: userIds[3] },
      { post_id: postIds[1], user_id: userIds[0] },
      { post_id: postIds[1], user_id: userIds[2] },
      { post_id: postIds[1], user_id: userIds[4] },
      { post_id: postIds[2], user_id: userIds[1] },
      { post_id: postIds[2], user_id: userIds[5] },
      { post_id: postIds[3], user_id: userIds[0] },
      { post_id: postIds[3], user_id: userIds[2] },
      { post_id: postIds[3], user_id: userIds[4] },
      { post_id: postIds[3], user_id: userIds[6] },
      { post_id: postIds[4], user_id: userIds[1] },
      { post_id: postIds[4], user_id: userIds[3] },
      { post_id: postIds[4], user_id: userIds[5] },
    ];

    for (const like of likes) {
      await connection.query(
        'INSERT INTO likes (post_id, user_id) VALUES (?, ?)',
        [like.post_id, like.user_id]
      );
    }
    console.log(`✅ Created ${likes.length} likes\n`);

    // Seed Comments
    console.log('💬 Seeding comments...');
    const comments = [
      {
        post_id: postIds[0],
        user_id: userIds[1],
        content: 'مقال رائع! أنا أيضاً أتعلم React Native حالياً'
      },
      {
        post_id: postIds[0],
        user_id: userIds[2],
        content: 'شكراً على المشاركة، نصائح مفيدة جداً'
      },
      {
        post_id: postIds[1],
        user_id: userIds[0],
        content: 'اللوحة جميلة جداً! أحب الألوان'
      },
      {
        post_id: postIds[1],
        user_id: userIds[3],
        content: 'إبداع حقيقي، استمري'
      },
      {
        post_id: postIds[2],
        user_id: userIds[4],
        content: 'قصة مؤثرة، متى سنقرأ المزيد؟'
      },
      {
        post_id: postIds[3],
        user_id: userIds[5],
        content: 'هل يمكنك مشاركة تفاصيل الروتين؟'
      },
      {
        post_id: postIds[4],
        user_id: userIds[6],
        content: 'اليابان على قائمتي! أي نصائح؟'
      },
      {
        post_id: postIds[5],
        user_id: userIds[7],
        content: 'دروس قيمة، شكراً على الصراحة'
      },
    ];

    for (const comment of comments) {
      await connection.query(
        'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
        [comment.post_id, comment.user_id, comment.content]
      );
    }
    console.log(`✅ Created ${comments.length} comments\n`);

    // Seed Follows
    console.log('👥 Seeding follows...');
    const follows = [
      { follower_id: userIds[0], followed_id: userIds[1] },
      { follower_id: userIds[0], followed_id: userIds[2] },
      { follower_id: userIds[1], followed_id: userIds[0] },
      { follower_id: userIds[1], followed_id: userIds[3] },
      { follower_id: userIds[2], followed_id: userIds[0] },
      { follower_id: userIds[2], followed_id: userIds[4] },
      { follower_id: userIds[3], followed_id: userIds[1] },
      { follower_id: userIds[4], followed_id: userIds[2] },
      { follower_id: userIds[5], followed_id: userIds[0] },
      { follower_id: userIds[6], followed_id: userIds[1] },
    ];

    for (const follow of follows) {
      await connection.query(
        'INSERT INTO follows (follower_id, followed_id) VALUES (?, ?)',
        [follow.follower_id, follow.followed_id]
      );
    }
    console.log(`✅ Created ${follows.length} follows\n`);

    console.log('🎉 ═══════════════════════════════════════════════════');
    console.log('   Database seeding completed successfully!');
    console.log('   ═══════════════════════════════════════════════════');
    console.log('');
    console.log('   📊 Seeded data:');
    console.log(`   - ${users.length} users (including 1 admin)`);
    console.log(`   - ${posts.length} posts`);
    console.log(`   - ${likes.length} likes`);
    console.log(`   - ${comments.length} comments`);
    console.log(`   - ${follows.length} follows`);
    console.log('');
    console.log('   🔐 Test credentials:');
    console.log('   Phone: 07701234567');
    console.log('   Password: password123');
    console.log('');
    console.log('   👨‍💼 Admin credentials:');
    console.log('   Phone: 07789012345');
    console.log('   Password: password123');
    console.log('');
    console.log('   ═══════════════════════════════════════════════════');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('\n✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedData };